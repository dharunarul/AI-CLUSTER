"use client";

import { useState, useRef, useEffect } from "react";

const topicPatterns = [
  {
    topic: "greeting",
    patterns: /^(hi|hello|hey|howdy|greetings|sup|yo|what'?s up|good (morning|afternoon|evening))/i,
    responses: [
      "Hey there! Great to see you. What's on your mind today?",
      "Hello! I'm ready to chat about whatever you'd like. What's up?",
      "Hi! Hope you're having a great day. What would you like to talk about?",
      "Hey! Nice to meet you. Feel free to ask me anything or just chat.",
    ],
  },
  {
    topic: "farewell",
    patterns: /^(bye|goodbye|see you|later|take care|gotta go|cya|ttyl|night)/i,
    responses: [
      "It was great chatting with you! Come back anytime.",
      "See you later! Hope I was helpful. Have a wonderful day!",
      "Goodbye! Don't hesitate to come back if you have more questions.",
      "Take care! It was a pleasure talking with you.",
    ],
  },
  {
    topic: "thanks",
    patterns: /^(thanks|thank you|thx|ty|appreciate|helpful)/i,
    responses: [
      "You're welcome! Happy I could help. Anything else on your mind?",
      "Glad I could assist! Let me know if there's anything else you need.",
      "My pleasure! I'm here whenever you want to chat more.",
      "No problem at all! That's what I'm here for.",
    ],
  },
  {
    topic: "weather",
    patterns: /weather|temperature|rain|sunny|cold|hot|forecast|climate/i,
    responses: [
      "Weather is fascinating! It's driven by complex atmospheric systems. Are you interested in meteorology, or just wondering about today's forecast?",
      "I don't have real-time weather data, but I can chat about weather patterns and climate science. What interests you about weather?",
      "The weather has been quite unpredictable lately! Climate change is making traditional patterns less reliable. Want to discuss the science behind it?",
      "Weather affects our daily lives more than we realize. From agriculture to mood, it all connects. What aspect of weather interests you most?",
    ],
  },
  {
    topic: "technology",
    patterns: /tech|ai|artificial intelligence|machine learning|programming|coding|software|computer|robot|blockchain|crypto|app|cloud|data science/i,
    responses: [
      "Technology is reshaping our world at an incredible pace! AI and machine learning are particularly exciting right now. What area of tech fascinates you most?",
      "The tech world is evolving so rapidly. From AI breakthroughs to quantum computing, there's always something new. Are you working on any tech projects?",
      "I'm passionate about technology! Whether it's web development, AI, cybersecurity, or emerging tech, there's so much to explore. What's your tech interest?",
      "Technology is both powerful and humbling — there's always more to learn. What aspect of tech would you like to dive into?",
    ],
  },
  {
    topic: "science",
    patterns: /science|physics|chemistry|biology|quantum|universe|space|astronomy|research|experiment|hypothesis|atom|molecule/i,
    responses: [
      "Science is the ultimate exploration of reality! From quantum physics to cosmology, every discovery opens new questions. What field of science captivates you?",
      "The beauty of science is that it constantly challenges our understanding. What scientific topic are you most curious about?",
      "Science is how we make sense of the universe. Whether it's biology, physics, or chemistry, each field reveals incredible truths. What would you like to explore?",
      "I love discussing science! It's the foundation of our understanding of everything. Are you interested in a specific scientific topic or discovery?",
    ],
  },
  {
    topic: "health",
    patterns: /health|exercise|diet|nutrition|fitness|mental health|sleep|wellness|medical|doctor|meditation|yoga|stress/i,
    responses: [
      "Health is our most valuable asset! A balanced approach combining physical activity, nutrition, mental wellness, and adequate sleep works best. What aspect of health are you focusing on?",
      "Great topic! Regular exercise, proper nutrition, good sleep hygiene, and stress management are the pillars of wellness. Would you like to dive deeper into any of these?",
      "Health is holistic — it's about balancing body, mind, and spirit. Small consistent changes often make the biggest difference. What health goal are you working toward?",
      "Taking care of our health is so important. From nutrition to exercise to mental wellness, every piece matters. What would you like to know more about?",
    ],
  },
  {
    topic: "philosophy",
    patterns: /meaning of life|purpose|consciousness|free will|reality|exist|truth|ethics|moral|think|thought|mind|soul/i,
    responses: [
      "Philosophical questions are endlessly fascinating! The nature of consciousness, free will, and reality have puzzled thinkers for millennia. What philosophical question interests you?",
      "That's a deep question! Philosophy helps us examine the foundations of knowledge, existence, and ethics. What's your perspective on it?",
      "These are the big questions that define our understanding of life. From Plato to modern thinkers, philosophy continues to evolve. What school of thought resonates with you?",
      "I love philosophical discussions! They push us to think beyond the obvious. What aspect of philosophy are you most drawn to?",
    ],
  },
  {
    topic: "food",
    patterns: /food|cook|recipe|restaurant|cuisine|eat|meal|dinner|lunch|breakfast|bake|chef|ingredient|flavor/i,
    responses: [
      "Food is one of life's greatest pleasures! From simple home cooking to gourmet cuisine, there's always something new to discover. What kind of food do you enjoy?",
      "Cooking is both an art and a science. The way flavors combine, textures interact, and techniques evolve makes it endlessly interesting. Do you cook often?",
      "Food culture varies so beautifully around the world. Each cuisine tells a story about its people and history. What's your favorite cuisine to explore?",
      "Great food topic! Whether it's comfort food, exotic cuisine, or healthy eating, there's always something delicious to discuss. What are you in the mood for?",
    ],
  },
  {
    topic: "travel",
    patterns: /travel|trip|vacation|destination|country|explore|adventure|flight|hotel|beach|mountain|city|tourist/i,
    responses: [
      "Travel opens our minds to new cultures, perspectives, and experiences! There's nothing quite like exploring a new place. Where have you been or where would you like to go?",
      "The world is full of incredible destinations! From bustling cities to serene nature spots, every place has its own character. What's your dream travel destination?",
      "Travel creates memories that last a lifetime. Whether it's a weekend getaway or an around-the-world adventure, the journey is always rewarding. Where are you headed?",
      "I love talking about travel! Every destination offers unique experiences and cultural insights. Have you discovered any hidden gems recently?",
    ],
  },
  {
    topic: "music",
    patterns: /music|song|band|artist|concert|album|playlist|guitar|piano|genre|concert|listen/i,
    responses: [
      "Music is a universal language! It connects people across cultures and generations. What genre or artist are you currently enjoying?",
      "The power of music is incredible — it can change our mood, bring back memories, and inspire creativity. What are you listening to lately?",
      "Music has such diverse styles, from classical to electronic, jazz to rock. Each genre offers something unique. What resonates with you most?",
      "Great music taste is subjective, which makes it so fascinating! From live concerts to personal playlists, music enriches our lives. What's your current favorite?",
    ],
  },
  {
    topic: "question",
    patterns: /^(what|how|why|when|where|who|can you|could you|do you|is there|are there)/i,
    responses: [
      "That's a great question! Let me think about this... While I don't have real-time data, I can offer my perspective based on general knowledge. Could you provide more context so I can give a better answer?",
      "Interesting question! From what I understand, the key is to break it down into smaller parts. What specific aspect would you like to focus on?",
      "Good question! There are multiple angles to consider here. Let me share what I know, and feel free to ask follow-up questions.",
      "I appreciate your curiosity! That's a topic with a lot of depth. Let me share my thoughts on it.",
    ],
  },
  {
    topic: "opinion",
    patterns: /i think|i believe|in my opinion|i feel like|personally|my view|my take|imo|imo|frankly|honestly/i,
    responses: [
      "That's an interesting perspective! There's definitely merit to that view. I'd also consider looking at it from other angles — what do you think about the counterpoint?",
      "I appreciate you sharing your thoughts! It's always valuable to hear different viewpoints. How did you arrive at that conclusion?",
      "You raise a good point. Different experiences and knowledge lead to diverse opinions, and that's what makes discussions enriching. Have you considered alternative viewpoints?",
      "That's a thoughtful opinion. The best discussions happen when we consider multiple perspectives. What shaped your thinking on this?",
    ],
  },
  {
    topic: "joke",
    patterns: /joke|funny|humor|laugh|make me laugh|something funny|comedy|pun/i,
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs! 😄 Want to hear another one?",
      "Here's one: A SQL query walks into a bar, sees two tables, and asks... 'Can I join you?' 🤣 How about a science joke?",
      "Why did the scarecrow win an award? He was outstanding in his field! 😄 I've got plenty more where that came from.",
      "What do you call a fake noodle? An impasta! 🍝 Want to hear more, or shall we talk about something else?",
    ],
  },
  {
    topic: "motivation",
    patterns: /motivat|inspire|goal|dream|success|achieve|hard|give up|struggle|difficult|can'?t|impossible|stuck/i,
    responses: [
      "Remember: every expert was once a beginner. The key is to start small, stay consistent, and keep moving forward. What's one step you can take today?",
      "The path to success isn't always straight — it's okay to stumble. What matters is that you get back up and keep trying. You've got this!",
      "Progress isn't always visible, but it's happening. Trust the process, celebrate small wins, and remember why you started. What's your 'why'?",
      "When things get tough, remember that challenges are just opportunities in disguise. You've overcome obstacles before, and you'll do it again. What's one goal you're working toward?",
    ],
  },
];

const fallbackResponses = [
  "That's a really interesting topic! I'd love to hear more about your thoughts on it. What specifically interests you about this?",
  "Thanks for bringing that up! There's a lot to unpack here. Could you tell me more about what you're looking for?",
  "Interesting point! I have some thoughts on this. Let me think... What's the most important aspect for you?",
  "Great topic! It's one of those areas where there's always more to explore. What angle would you like to discuss?",
  "I appreciate you sharing that! It's a multifaceted subject. What's your take on it so far?",
  "That's something I find fascinating too. The more you dig into it, the more layers you discover. Where would you like to start?",
  "Good point! There are definitely multiple ways to look at this. What's your perspective?",
  "I'd love to chat more about this! It's a topic with a lot of depth. What aspect should we focus on?",
];

function detectTopic(input) {
  const cleaned = input.trim();
  for (const tp of topicPatterns) {
    if (tp.patterns.test(cleaned)) {
      return tp;
    }
  }
  return null;
}

function generateResponse(input, history) {
  const topic = detectTopic(input);

  if (topic) {
    return topic.responses[Math.floor(Math.random() * topic.responses.length)];
  }

  const words = input.toLowerCase().split(/\s+/);
  const significantWords = words.filter(
    (w) => w.length > 3 && !["what", "about", "your", "think", "does", "this", "that", "have", "been", "with", "from", "they", "their", "would", "could", "should", "there", "here", "just", "really", "very", "also", "some", "like", "more", "than"].includes(w)
  );

  if (significantWords.length > 0) {
    const topicWord = significantWords[0];
    const contextPhrase = history.length > 0
      ? `Earlier we were talking, and now you bring up ${topicWord}. `
      : "";
    return `${contextPhrase}${topicWord.charAt(0).toUpperCase() + topicWord.slice(1)} is definitely worth discussing! I find it's one of those topics where context really matters. Can you tell me more about what specifically about ${topicWord} you're interested in?`;
  }

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

export default function ChatMate({ agent }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm ChatMate, your conversational AI assistant. I can discuss a wide range of topics — from technology and science to philosophy, health, and more. Feel free to ask me anything or just chat!",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      text: input.trim(),
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 1200));

    const responseText = generateResponse(userMsg.text, messages);

    const botMsg = {
      id: Date.now() + 1,
      text: responseText,
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4 px-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 animate-fadeInUp ${
              msg.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-purple-500 to-violet-600"
                  : "bg-gradient-to-br from-sky-500 to-blue-600"
              }`}
            >
              {msg.sender === "user" ? "👤" : "💬"}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === "user"
                  ? "bg-purple-600/30 border border-purple-500/30"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className="text-[10px] text-gray-500 mt-1 text-right">{msg.time}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-sm flex-shrink-0">
              💬
            </div>
            <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
