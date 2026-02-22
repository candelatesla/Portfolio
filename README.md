# Personal Portfolio Website

This is a responsive, interactive portfolio site for Yash Chetan Doshi.

## Sections
- Education
- Experience
- Projects
- Research
- Contact

## Included Features
- Sticky nav with active section highlighting
- Scroll reveal animations
- Project filtering (AI / Data / Web)
- Interactive card tilt effect
- Contact form wired to FormSubmit AJAX endpoint
- GitHub, LinkedIn, and email links

## Local Preview
Because this is a static site, you can run any static server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy to GitHub + Vercel
1. Initialize git (if needed):
   ```bash
   git init
   ```
2. Commit and push to GitHub.
3. In Vercel, import the GitHub repo.
4. Framework preset: `Other` (static site).
5. Deploy.

## Contact Form Note
The contact form is currently configured to send to:
- `yash.doshi@tamu.edu`

If you ever want a different email, replace it in:
- `script.js` (FormSubmit endpoint)
