import asyncio, edge_tts
CLIPS = {
  "fr_greet": "გამარჯობა! მე ნიკო ვარ. რა გინდა ვითამაშოთ?",
  "fr_win":   "ბრავო! შენ შეძელი!",
}
async def main():
    for name, text in CLIPS.items():
        c = edge_tts.Communicate(text, "ka-GE-EkaNeural")
        await c.save(f"niko/audio/{name}.mp3")
        print("saved", name)
asyncio.run(main())
