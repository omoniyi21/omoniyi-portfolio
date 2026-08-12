from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/workspace/scratch/fa212c952631/generated_images/exec-8ec4fed1-7389-46c6-9902-3f2954399b11.png')
OUT = ROOT / 'png'
OUT.mkdir(parents=True, exist_ok=True)

image = Image.open(SOURCE).convert('RGBA')


def extract(name, bbox, polygons, feather=1.15, source_image=None):
    mask = Image.new('L', image.size, 0)
    draw = ImageDraw.Draw(mask)
    for polygon in polygons:
        draw.polygon(polygon, fill=255)
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    crop = (source_image or image).crop(bbox)
    alpha = mask.crop(bbox)
    crop.putalpha(alpha)
    crop.save(OUT / f'{name}.png', optimize=True)


extract(
    '01-reading-artists-way',
    (405, 110, 712, 463),
    [[(420, 151), (511, 145), (516, 119), (604, 120), (609, 145),
      (687, 149), (704, 440), (683, 449), (432, 448), (419, 431)]],
)

extract(
    '02-watching-from-furious',
    (694, 115, 1085, 486),
    [[(708, 137), (1067, 128), (1074, 470), (713, 473)]],
)

extract(
    '03-movie-i-love-boosters-ticket',
    (1082, 124, 1490, 441),
    [[(1118, 136), (1457, 151), (1473, 168), (1467, 405), (1452, 422),
      (1120, 410), (1096, 397), (1098, 159)]],
)

extract(
    '04-podcast-good-noticings',
    (958, 474, 1223, 687),
    [[(978, 489), (1090, 496), (1094, 477), (1161, 485), (1164, 501),
      (1208, 498), (1197, 672), (974, 653)]],
)

# Restore the part of the dark music print that is hidden beneath the to-do scrap
# in the full composition. The replacement uses adjacent night texture from the
# same card so the standalone asset remains complete.
music_image = image.copy()
night_texture = image.crop((1290, 715, 1444, 838)).resize((226, 123))
music_image.paste(night_texture, (1218, 715))

extract(
    '05-on-repeat-music',
    (1204, 440, 1481, 856),
    [
        [(1230, 458), (1465, 466), (1444, 838), (1218, 816)],
        [(1293, 444), (1380, 448), (1384, 466), (1290, 462)],
    ],
    source_image=music_image,
)

extract(
    '06-current-scent-ode-to-dullness',
    (408, 447, 709, 938),
    [
        [(424, 491), (603, 488), (645, 919), (424, 920)],
        [(589, 476), (621, 459), (645, 465), (692, 900), (640, 912)],
    ],
)

extract(
    '07-current-ritual',
    (681, 671, 1088, 966),
    [[(699, 689), (1068, 683), (1075, 944), (706, 951), (693, 938)]],
)

extract(
    '08-current-thought',
    (688, 484, 962, 689),
    [[(708, 501), (946, 502), (951, 662), (937, 672), (712, 676), (702, 658)]],
)

extract(
    '09-todo-list',
    (1065, 692, 1310, 975),
    [
        [(1089, 734), (1101, 719), (1120, 715), (1124, 711),
         (1227, 716), (1241, 725), (1275, 732), (1293, 954),
         (1080, 948)],
        [(1145, 696), (1165, 698), (1170, 760), (1148, 760)],
    ],
)

def extract_stardust(name, bbox):
    crop = image.crop(bbox)
    rgb = crop.convert('RGB')
    barrier = Image.new('L', crop.size, 0)
    src = rgb.load()
    out = barrier.load()

    # Ink, blush and crater marks form a closed contour around the cream body.
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b = src[x, y]
            dark_ink = r < 150 and g < 150 and b < 150
            pink_mark = r > 180 and r > g * 1.18 and r > b * 1.05
            gray_mark = max(r, g, b) - min(r, g, b) < 22 and r < 205
            if dark_ink or pink_mark or gray_mark:
                out[x, y] = 255

    barrier = barrier.filter(ImageFilter.MaxFilter(5))
    flooded = barrier.copy()
    for seed in [(0, 0), (crop.width - 1, 0), (0, crop.height - 1),
                 (crop.width - 1, crop.height - 1)]:
        ImageDraw.floodfill(flooded, seed, 128, thresh=0)

    flood_px = flooded.load()
    alpha = Image.new('L', crop.size, 0)
    alpha_px = alpha.load()
    for y in range(crop.height):
        for x in range(crop.width):
            # Retain the closed cream body and all expressive linework/limbs.
            if flood_px[x, y] != 128:
                alpha_px[x, y] = 255

    alpha = alpha.filter(ImageFilter.GaussianBlur(.55))
    crop.putalpha(alpha)
    crop.save(OUT / f'{name}.png', optimize=True)


extract_stardust('10-stardust-peeking', (792, 76, 888, 145))
extract_stardust('11-stardust-observing', (103, 728, 239, 878))


def constellation_trail():
    scale = 4
    width, height = 520, 180
    canvas = Image.new('RGBA', (width * scale, height * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    def bezier(t):
        p0, p1, p2, p3 = (20, 124), (150, 55), (298, 175), (486, 62)
        x = ((1-t)**3*p0[0] + 3*(1-t)**2*t*p1[0] + 3*(1-t)*t*t*p2[0] + t**3*p3[0])
        y = ((1-t)**3*p0[1] + 3*(1-t)**2*t*p1[1] + 3*(1-t)*t*t*p2[1] + t**3*p3[1])
        return int(x * scale), int(y * scale)

    pts = [bezier(i / 90) for i in range(91)]
    for i in range(0, len(pts) - 1, 4):
        if i + 2 < len(pts):
            draw.line(pts[i:i+3], fill=(163, 163, 163, 190), width=2 * scale)

    def star(cx, cy, radius, color):
        cx, cy, radius = cx*scale, cy*scale, radius*scale
        points = []
        for i in range(8):
            angle = -math.pi/2 + i * math.pi/4
            r = radius if i % 2 == 0 else radius * .22
            points.append((cx + math.cos(angle)*r, cy + math.sin(angle)*r))
        draw.line(points + [points[0]], fill=color, width=2*scale, joint='curve')

    star(111, 73, 14, (255, 141, 182, 255))
    star(253, 135, 8, (124, 108, 255, 255))
    star(423, 76, 11, (27, 27, 31, 255))
    for x, y, color in [(67, 115, (255,178,107,255)), (186, 112, (255,141,182,255)),
                        (341, 118, (124,108,255,255)), (473, 54, (255,141,182,255))]:
        r = 3 * scale
        draw.ellipse((x*scale-r, y*scale-r, x*scale+r, y*scale+r), fill=color)

    canvas.resize((width, height), Image.Resampling.LANCZOS).save(
        OUT / '12-decorative-constellation-trail.png', optimize=True
    )


constellation_trail()

print(f'Created {len(list(OUT.glob("*.png")))} transparent PNG assets in {OUT}')
