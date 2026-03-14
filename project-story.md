## Inspiration

I was standing in a supermarket, holding a bottle of juice that looked healthy — "natural," "vitamin-enriched," the label said. Then I flipped it over. 47 grams of sugar per serving. I had no idea what that meant relative to my daily limit, whether the ingredients were actually safe, or how this compared to alternatives.

That moment made me realize: nutrition labels are designed for compliance, not for people. Most of us skip them entirely because decoding them takes effort we don't have at the shelf.

I wanted to build something that removes that friction completely — an agent that **sees the label for you** and gives a clear, instant verdict.

---

## What it does

**Health Nutrition Analyzer** is a real-time multimodal AI nutrition agent. The user opens the app, points their smartphone camera at any food product, and within seconds receives:

- A full **ingredient list** extracted directly from the label
- **Total sugar content** and sugar per serving
- A **health score** from 0–100 with a letter grade (A / B / C)
- **Personalized recommendations** and dietary risk flags

No typing. No barcode scanning. No database lookup. The agent reads and reasons about the label directly using **Google Gemini's multimodal vision capabilities**.

The scoring model is based on:

$$\text{Health Score} = 100 - \left( \frac{\text{Sugar per serving (g)}}{50} \times 60 \right) - \text{Ingredient Risk Penalty}$$

Where the ingredient risk penalty accounts for artificial additives, preservatives, and high-glycemic sweeteners detected by Gemini.

Grade thresholds:

| Score | Grade | Meaning |
|-------|-------|---------|
| 80–100 | 🟢 A | Excellent nutritional value |
| 60–79 | 🟡 B | Moderate — room for improvement |
| 0–59 | 🔴 C | Poor — high sugar or harmful ingredients |

The app also includes an AI agent layer for conversational nutrition advice, meal combination analysis, and personalized recommendations based on user profile and analysis history.

---

## How we built it

The stack is intentionally lean and cloud-native:

- **Frontend**: React 18 + TypeScript + Vite, deployed to **Firebase Hosting**
- **Backend**: Node.js + Express, containerized with Docker, deployed to **Google Cloud Run**
- **AI**: Google Gemini 1.5 Flash — multimodal image analysis + nutrition reasoning
- **CI/CD**: Cloud Build + GitHub Actions for fully automated build and deploy pipeline

The analysis flow:
1. User captures a live camera frame or uploads a photo
2. Frontend sends the image as base64 to `POST /api/analyze/livestream` or `/api/analyze/image`
3. Backend constructs a structured multimodal prompt and calls Gemini
4. Gemini extracts ingredients, calculates sugar content, and generates recommendations
5. Frontend renders the result with score, grade color, and actionable advice

The backend is fully stateless — designed for Cloud Run's ephemeral execution model. All context is passed per-request, which also improves reliability and testability.

---

## Challenges we ran into

**Camera access on mobile over HTTPS**
Browser security blocks `getUserMedia` on non-HTTPS origins. We had to set up TLS certificates for local development and ensure both Cloud Run and Firebase Hosting served over HTTPS in production — not trivial to wire up end to end.

**Structured output from Gemini**
Getting Gemini to return consistently structured JSON (not freeform prose) required careful prompt engineering with explicit output schemas and example responses. Hallucinations on partially visible or low-contrast labels were reduced by grounding the prompt with nutritional reference values and explicit fallback instructions.

**Stateless design on Cloud Run**
Cloud Run instances spin down between requests, making stateful patterns impossible. We redesigned the AI agent to be fully stateless — all history and user context is passed per-request from the client.

**Cold start latency**
First-request latency on Cloud Run could reach 2–3 seconds. We mitigated this with minimum instance configuration and a lightweight `/health` warm-up endpoint.

---

## Accomplishments that we're proud of

- **Zero-text UX** — the entire analysis flow works without the user typing a single character
- Gemini accurately reads real-world product labels with glare, angles, and partial occlusion
- Full **CI/CD pipeline** from push to production in under 3 minutes using Cloud Build and GitHub Actions
- Mobile-first responsive design that works seamlessly on any smartphone browser
- Clean nutrition scoring formula that is transparent, explainable, and consistent
- The AI agent layer provides meaningful personalized advice — not just generic warnings

---

## What we learned

- Gemini's multimodal vision is remarkably capable at reading real-world product labels under imperfect conditions
- Prompt structure matters as much as model choice — a well-designed prompt with a clear output schema consistently outperforms a vague one
- Firebase Hosting + Cloud Run is an excellent serverless pair for mobile-first apps: globally distributed frontend, autoscaling backend, zero infrastructure management
- Building for real users on a smartphone changes everything about how you think about latency, camera UX, and one-handed interaction design
- Stateless API design is not just a Cloud Run constraint — it's good architecture that forces cleaner separation between client and server

---

## What's next for Health Nutrition Analyzer

- **Voice interaction** — let users ask follow-up questions out loud: "Is this safe for diabetics?" or "What's a healthier alternative?"
- **Gemini Live API integration** — continuous real-time analysis as the user slowly pans the camera across a shelf, without needing to tap "capture"
- **User health profiles** — persistent dietary goals, allergen flags, and calorie targets that personalize every recommendation
- **Comparison mode** — analyze two products side by side and get a direct recommendation on which to choose
- **Historical tracking** — weekly nutrition score trends and pattern insights across everything the user has scanned
- **Grocery list integration** — flag potentially unhealthy items before the user even reaches the store