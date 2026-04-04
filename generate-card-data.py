from pathlib import Path

cards_dir = Path("cards")
output_file = Path("card-data.js")

image_files = sorted(cards_dir.glob("*.png"))

lines = []
lines.append("const cardMaster = [")

for image_path in image_files:
    file_name = image_path.name
    stem = image_path.stem  # 0001 みたいな名前

    lines.append(
        f'  {{ id: "{stem}", name: "{stem}", image: "cards/{file_name}", maxCopies: 3 }},'
    )

lines.append("];")
lines.append("")

output_file.write_text("\n".join(lines), encoding="utf-8")

print(f"{len(image_files)}枚のカードを card-data.js に出力しました。")