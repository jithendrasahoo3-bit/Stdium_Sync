# STADIAPULSE 

**Live Demo:** https://stadiapulse.vercel.app/

I built this project to explore how AI can actually help with real-world crowd management at major events like the FIFA World Cup and Football tournaments or any big event but now we focus on FIFA as two football Stadium. This idea came from thinking about all what happens at big stadiums — gates bottleneck, Organizers don't know what to say to fans in different languages, and nobody really has a good way to make sense of what's happening in real-time.

# The Idea
I wanted to build something that would work for two different types of people at a stadium:

- **Organizers** (the people running the show) — they need to see what's actually happening in the stadium and understand where problems are going to pop up before they do
- **Fans** (everyone else) — they just want to know how to get to their seat without getting lost or stuck in a crazy line



# Requirements to run locally 

```bash
# Get the project running
cd stadiumsync-2026
npm install

# Set up your credentials

# VITE_GEMINI_API_KEY=your_gemini_api_key_here
# VITE_FIREBASE_API_KEY=your_firebase_api_key_here
# VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
# VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
# VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
# VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
# VITE_FIREBASE_APP_ID=your_firebase_app_id

# Start it up
npm run dev
```


# Tech used to Build.
The tech stack is pretty straightforward:
- **React + Vite** — I picked Vite because the dev server is insanely fast
- **TypeScript** — Caught a lot of bugs before they became problems
- **Tailwind CSS** — Made styling the cyber dashboard theme way easier
- **Firebase** — Storage  management for data.
- **Gemini API** — All the AI smarts happen here


# Important features in my Project 
**Real-time Crowd Analysis** — The organizer dashboard shows live data from 8 stadium gates, 9 facilities (restrooms, concessions, medical), and 5 security zones. The AI analyzes all this and suggests what to do next.
**Translation & Cultural Awareness** — Volunteers can ask the app to translate alerts to 8 different languages, and it adds cultural context so nothing gets lost in translation.
**Smart Routing** — Fans enter their seat location and the app generates turn-by-turn directions while trying to avoid bottlenecks and congestion.
**Voting & Live chats** - it is not fully developed but it helps the fan to do polls and get emergency massage form the organizers.

# Challenges I Ran Into
**API Rate Limiting** — This was my biggest headache. Gemini has pretty strict rate limits, and I kept hitting them during testing. I ended up implementing exponential backoff with jitter, which actually worked really well. Retrying requests with increasing delays instead of just hammering the API was the key.
**Handling 8-Language Translations Accurately** — Translation systems can be weird. I realized I needed to give the AI context about culture and local practices, not just word-for-word translations. A volunteer saying "please move away from the gate" needs different phrasing in different places.


Built by me for the FIFA World Cup 2026 project. It's a demonstration, but it actually works!
