"use client";

import { useState } from "react";

const templates = {
  explain: [
    (topic) => `## Understanding ${topic}\n\nAt its core, ${topic} represents a fundamental concept that has gained significant attention in recent years. To truly understand it, we need to break it down into its essential components.\n\n**Key Principles:**\n\n1. **Foundation**: The underlying framework of ${topic} is built upon established principles that have been refined over time. These principles guide how the concept is applied in practice.\n\n2. **Application**: In real-world scenarios, ${topic} manifests in various forms depending on the context. Its versatility makes it applicable across multiple domains.\n\n3. **Impact**: The significance of ${topic} lies in its ability to transform how we approach related challenges. By leveraging its core mechanisms, practitioners can achieve more efficient and effective outcomes.\n\n**In Summary:** ${topic} is a multifaceted concept that combines theoretical depth with practical utility. Understanding its key principles and applications provides a solid foundation for further exploration and mastery.`,
    (topic) => `## ${topic}: A Comprehensive Overview\n\n${topic} is an important concept that plays a crucial role in its field. Let me walk you through the key aspects.\n\n**What is ${topic}?**\nAt its simplest level, ${topic} refers to the systematic approach of organizing and optimizing processes within a given domain. It encompasses both the theoretical framework and practical methodologies used to achieve specific goals.\n\n**Why Does It Matter?**\nThe importance of ${topic} cannot be overstated. It provides a structured way to:\n- Improve efficiency and reduce waste\n- Enhance quality and consistency\n- Drive innovation and continuous improvement\n- Create measurable, actionable outcomes\n\n**How It Works:**\nThe mechanism behind ${topic} involves a cycle of analysis, implementation, measurement, and refinement. Each phase builds upon the previous one, creating a feedback loop that continuously improves results.\n\n**Key Takeaway:** Mastering ${topic} requires both theoretical understanding and hands-on practice. Start with the fundamentals and progressively build expertise through real-world application.`,
  ],
  write: [
    (topic) => `# ${topic}\n\nIn an era defined by rapid change and unprecedented challenges, the importance of ${topic.toLowerCase()} has never been more apparent. As we navigate through complex landscapes of innovation and disruption, understanding and embracing ${topic.toLowerCase()} becomes essential for success.\n\n## The Current Landscape\n\nToday's environment demands adaptability, creativity, and a willingness to challenge conventional thinking. Those who master ${topic.toLowerCase()} position themselves at the forefront of progress, equipped with the tools and mindset needed to thrive.\n\n## A Path Forward\n\nThe journey toward excellence in ${topic.toLowerCase()} begins with a single step: commitment to continuous learning. By staying curious, seeking diverse perspectives, and embracing feedback, we can unlock new possibilities and drive meaningful change.\n\n## Conclusion\n\n${topic} is not just a concept—it's a catalyst for transformation. Whether you're a seasoned professional or just starting your journey, the principles of ${topic.toLowerCase()} offer a roadmap for achieving your goals and making a lasting impact.`,
    (topic) => `# The Future of ${topic}\n\nThe world is changing at an accelerating pace, and nowhere is this more evident than in the realm of ${topic.toLowerCase()}. As technology advances and new paradigms emerge, we stand at the threshold of a new chapter.\n\n## Looking Ahead\n\nThe next decade promises remarkable developments in ${topic.toLowerCase()}. From breakthrough innovations to shifting societal norms, the landscape is evolving in ways that present both challenges and opportunities.\n\n## Key Trends to Watch\n\nSeveral emerging trends are shaping the future of ${topic.toLowerCase()}: technological integration, sustainable practices, and a renewed focus on human-centered design. Together, these forces are creating a more interconnected and dynamic ecosystem.\n\n## What You Can Do\n\nTo stay ahead of the curve, focus on building foundational skills while remaining adaptable to change. Embrace lifelong learning, cultivate diverse networks, and maintain a growth mindset.\n\nThe future of ${topic.toLowerCase()} belongs to those who are prepared to shape it.`,
  ],
  list: [
    (topic) => `# 10 Essential Facts About ${topic}\n\n1. **Historical Significance** — ${topic} has roots that trace back centuries, evolving from early foundational ideas into the complex field we know today.\n\n2. **Global Impact** — Across continents and cultures, ${topic.toLowerCase()} influences decisions in business, education, technology, and everyday life.\n\n3. **Rapid Growth** — The field of ${topic.toLowerCase()} has experienced exponential growth, with new developments emerging almost daily.\n\n4. **Interdisciplinary Nature** — ${topic} intersects with numerous other disciplines, making it a rich area for cross-functional collaboration.\n\n5. **Economic Influence** — The economic impact of ${topic.toLowerCase()} is substantial, driving innovation and creating new market opportunities.\n\n6. **Accessibility** — Thanks to digital tools and online resources, knowledge of ${topic.toLowerCase()} is more accessible than ever before.\n\n7. **Future Potential** — Experts predict that ${topic.toLowerCase()} will continue to evolve, with transformative applications on the horizon.\n\n8. **Community** — A vibrant global community of practitioners, researchers, and enthusiasts drives the advancement of ${topic.toLowerCase()}.\n\n9. **Ethical Considerations** — As ${topic.toLowerCase()} advances, important ethical questions arise that require thoughtful consideration.\n\n10. **Continuous Learning** — Success in ${topic.toLowerCase()} demands ongoing education and a commitment to staying current with developments.`,
    (topic) => `# Key Benefits of ${topic}\n\nHere are the most important advantages of understanding and applying ${topic.toLowerCase()}:\n\n**1. Enhanced Efficiency** — Streamline processes and achieve more with fewer resources.\n\n**2. Better Decision-Making** — Make informed choices backed by data and proven methodologies.\n\n**3. Competitive Advantage** — Stay ahead of peers by mastering cutting-edge techniques.\n\n**4. Innovation** — Foster creativity and develop novel solutions to complex problems.\n\n**5. Personal Growth** — Expand your skill set and increase your professional value.\n\n**6. Collaboration** — Build stronger teams through shared knowledge and best practices.\n\n**7. Adaptability** — Navigate change with confidence and agility.\n\n**8. Quality Outcomes** — Deliver consistently high-quality results that exceed expectations.\n\n**9. Scalability** — Create solutions that grow and evolve with your needs.\n\n**10. Impact** — Make a meaningful difference in your field and beyond.`,
  ],
  compare: [
    (topic) => `# Comparing Approaches to ${topic}\n\nWhen it comes to ${topic.toLowerCase()}, there are several distinct approaches, each with its own strengths and trade-offs.\n\n## Approach A: Traditional Methods\nThe traditional approach to ${topic.toLowerCase()} emphasizes established practices and proven methodologies. Its strengths include reliability, widespread acceptance, and a rich body of supporting research. However, it can be slower to adapt and may not fully leverage modern tools.\n\n## Approach B: Modern Innovations\nThe modern approach embraces new technologies and data-driven strategies. It offers speed, scalability, and precision, but may require significant upfront investment and can be complex to implement.\n\n## Approach C: Hybrid Strategy\nThe hybrid approach combines the best of both worlds. By integrating traditional principles with modern tools, it offers flexibility and adaptability. This approach is increasingly popular among organizations seeking balanced solutions.\n\n## Recommendation\nThe best approach depends on your specific context, goals, and resources. For most scenarios, a hybrid strategy provides the optimal balance of reliability and innovation.`,
    (topic) => `# ${topic}: Pros vs. Cons\n\nEvery approach to ${topic.toLowerCase()} comes with trade-offs. Here's an honest assessment.\n\n## Advantages\n\n- **Proven Results**: Established track record of success across industries\n- **Wide Support**: Extensive community and resource ecosystem\n- **Scalability**: Can grow from small projects to enterprise-level implementations\n- **Flexibility**: Adaptable to various contexts and requirements\n- **ROI**: Strong return on investment when implemented correctly\n\n## Disadvantages\n\n- **Complexity**: Can be overwhelming for beginners due to the breadth of knowledge required\n- **Resource Intensive**: May require significant time, money, or human resources\n- **Learning Curve**: Steep initial learning curve before becoming proficient\n- **Rapid Evolution**: Keeping up with changes requires continuous effort\n- **One Size Doesn't Fit All**: Not every solution works in every context\n\n## Bottom Line\n${topic} offers tremendous value when approached thoughtfully. The key is to start small, measure results, and iterate toward a solution that works for your specific needs.`,
  ],
  howto: [
    (topic) => `# How to Master ${topic}: A Step-by-Step Guide\n\n## Step 1: Build Your Foundation\nStart by understanding the core principles of ${topic.toLowerCase()}. Read introductory materials, take online courses, and familiarize yourself with key terminology.\n\n## Step 2: Learn from Experts\nFollow thought leaders in the field of ${topic.toLowerCase()}. Subscribe to blogs, podcasts, and newsletters. Join communities where practitioners share insights and experiences.\n\n## Step 3: Practice Regularly\nApply what you learn through hands-on projects. Start with simple exercises and gradually increase complexity. Consistent practice is the fastest path to mastery.\n\n## Step 4: Seek Feedback\nShare your work with peers and mentors. Constructive criticism accelerates growth and helps you identify blind spots.\n\n## Step 5: Stay Current\nThe field of ${topic.toLowerCase()} evolves rapidly. Dedicate time each week to learning about new developments, tools, and methodologies.\n\n## Step 6: Teach Others\nOne of the best ways to solidify your knowledge is to teach it. Write articles, give presentations, or mentor newcomers.\n\n## Conclusion\nMastering ${topic.toLowerCase()} is a journey, not a destination. Stay curious, stay consistent, and enjoy the process of continuous growth.`,
    (topic) => `# Getting Started with ${topic}\n\nThis guide will help you take your first steps in ${topic.toLowerCase()} with confidence.\n\n**Prerequisites:**\n- Basic understanding of related concepts\n- Willingness to experiment and make mistakes\n- Access to relevant tools and resources\n\n**Phase 1: Exploration (Week 1-2)**\nBegin by exploring the landscape of ${topic.toLowerCase()}. Read overview articles, watch introductory videos, and take notes on what interests you most.\n\n**Phase 2: Foundation (Week 3-4)**\nDive deeper into core concepts. Focus on understanding the "why" behind each principle, not just the "how."\n\n**Phase 3: Application (Week 5-8)**\nStart applying your knowledge to real projects. Begin with small, manageable tasks and progressively take on more complex challenges.\n\n**Phase 4: Refinement (Ongoing)**\nContinuously review and improve your approach. Seek feedback, learn from mistakes, and refine your techniques.\n\n**Pro Tip:** Don't try to learn everything at once. Focus on the most impactful concepts first and build from there.`,
  ],
};

function detectIntent(prompt) {
  const lower = prompt.toLowerCase();
  const topic = prompt.replace(/^(explain|write|list|compare|how to|how do i|tell me about|describe|what is|what are|give me)\s*/i, "").trim() || prompt;

  if (/^(explain|what is|what are|describe|tell me about|define|how does|how do)/.test(lower)) return { type: "explain", topic };
  if (/^(write|draft|compose|create|make)\s/.test(lower)) return { type: "write", topic };
  if (/^(list|top|best|key|enumerate|give me)/.test(lower)) return { type: "list", topic };
  if (/^(compare|vs|versus|difference between|pros and cons)/.test(lower)) return { type: "compare", topic };
  if (/^(how to|how do i|how can i|steps to|guide)/.test(lower)) return { type: "howto", topic };
  if (lower.length < 30) return { type: "explain", topic };
  if (lower.split(" ").length > 30) return { type: "write", topic };
  return { type: "explain", topic };
}

function generateResponse(prompt) {
  const intent = detectIntent(prompt);
  const options = templates[intent.type];
  const template = options[Math.floor(Math.random() * options.length)];
  return {
    text: template(intent.topic),
    intent: intent.type,
  };
}

export default function TextGPT({ agent }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [streaming, setStreaming] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    setIntent("");
    setStreaming(true);

    await new Promise((r) => setTimeout(r, 500));

    const result = generateResponse(prompt);
    setIntent(result.intent);

    let current = "";
    const chars = result.text.split("");
    for (let i = 0; i < chars.length; i++) {
      current += chars[i];
      setResponse(current);
      if (i % 3 === 0) await new Promise((r) => setTimeout(r, 8));
    }

    setStreaming(false);
    setLoading(false);
    setHistory((prev) => [
      {
        prompt: prompt.trim(),
        response: result.text,
        intent: result.intent,
      },
      ...prev.slice(0, 9),
    ]);
  }

  function loadFromHistory(item) {
    setPrompt(item.prompt);
    setResponse(item.response);
    setIntent(item.intent);
  }

  const wordCount = response ? response.split(/\s+/).filter((w) => w).length : 0;

  const intentLabels = {
    explain: "Explanation",
    write: "Creative Writing",
    list: "Listicle",
    compare: "Comparison",
    howto: "How-To Guide",
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Try: 'Explain machine learning', 'Write about climate change', 'List the benefits of meditation', 'Compare Python vs JavaScript', 'How to learn programming'..."
          rows={4}
          className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
        />
        {prompt.trim() && (
          <p className="text-xs text-gray-500 mt-1">
            Detected intent: <span className="text-violet-400">{intentLabels[detectIntent(prompt).type] || "General"}</span>
          </p>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate
          </>
        )}
      </button>

      {response && (
        <div className="bg-black/30 border border-white/10 rounded-xl p-6 animate-fadeInUp">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wider">
              Response {intent && `· ${intentLabels[intent]}`}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{wordCount} words</span>
              {streaming && (
                <span className="text-xs text-violet-400 animate-pulse">streaming...</span>
              )}
              <button
                onClick={() => navigator.clipboard.writeText(response)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Copy to clipboard"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-gray-200 leading-relaxed whitespace-pre-wrap font-sans text-sm">
            {response}
            {streaming && <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse ml-0.5" />}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recent Generations
          </h3>
          <div className="space-y-2">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => loadFromHistory(item)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left"
              >
                <span className="text-xs text-violet-400 shrink-0">
                  {intentLabels[item.intent]}
                </span>
                <span className="text-sm text-gray-300 truncate">{item.prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
