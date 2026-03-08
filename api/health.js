export default function handler(_req, res) {
  res.status(200).json({ ok: true, groqConfigured: Boolean(process.env.GROQ_API_KEY) });
}
