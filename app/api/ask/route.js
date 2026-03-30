import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractChatText(completion) {
  const content = completion?.choices?.[0]?.message?.content;

  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (!part) return '';
        if (part.type === 'text' && part.text) return part.text;
        return '';
      })
      .join('\n')
      .trim();
  }

  return '';
}

export async function POST(req) {
  try {
    const body = await req.json();
    const question = String(body?.question || '').trim();
    const mode = body?.mode === 'deep' ? 'deep' : 'free';

    console.log('INPUT:', question);
    console.log('MODE:', mode);
    console.log('KEY?', !!process.env.OPENAI_API_KEY);

    if (!question) {
      return NextResponse.json({ error: '问题不能为空' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY 未配置' },
        { status: 500 }
      );
    }

    const developerPrompt =
      mode === 'deep'
        ? `
你是“看清”产品里的深度分析助手。

用户会提出一个现实中的困惑。你的任务不是安慰，也不是空泛鼓励，而是帮助他把问题看清。

请严格按这个结构输出，且每一部分都要有明确标题：

核心判断：
用 2-4 句直接说明你对这个问题的整体判断。

关键矛盾：
指出这个问题真正卡住用户的地方，不要停留在表面。

影响因素：
列出 3 点最重要的影响因素。每一点都要有简短解释。

建议路径：
给出一个清晰、可执行的下一步建议。不要只是“再想想”。

要求：
- 中文回答
- 冷静、清楚、克制
- 不要鸡汤
- 不要故作高深
- 总长度控制在 450~700 字
- 直接输出正文，不要解释你的思考过程
`
        : `
你是“看清”产品里的快速判断助手。

用户会提出一个现实中的困惑。你的任务是快速抓住核心，并给出一个有方向感的判断。

请严格按这个结构输出，且每一部分都要有明确标题：

倾向判断：
直接给出当前倾向，不要模糊。

关键原因：
给出 2 点最关键理由，每一点一句到两句。

建议：
给出一个立刻可执行的小建议。

要求：
- 中文回答
- 简洁、锋利、直接
- 不空泛
- 不长篇展开
- 不鸡汤
`;

    const completion = await client.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'developer',
          content: developerPrompt,
        },
        {
          role: 'user',
          content: `问题：${question}`,
        },
      ],
      reasoning_effort: mode === 'deep' ? 'low' : 'minimal',
      max_completion_tokens: mode === 'deep' ? 2600 : 700,
    });

    const answer = extractChatText(completion);

    console.log(
      'FINISH REASON:',
      completion?.choices?.[0]?.finish_reason || 'unknown'
    );
    console.log('HAS CONTENT:', !!answer);
    console.log(
      'REASONING TOKENS:',
      completion?.usage?.completion_tokens_details?.reasoning_tokens ?? 0
    );
    console.log(
      'COMPLETION TOKENS:',
      completion?.usage?.completion_tokens ?? 0
    );

    if (!answer) {
      console.log('FULL CHAT RESPONSE:', JSON.stringify(completion, null, 2));
      return NextResponse.json({
        answer: '这次分析没有成功生成可显示内容。请再试一次。',
      });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('/api/ask error:', error);
    return NextResponse.json(
      { error: error?.message || '服务器错误' },
      { status: 500 }
    );
  }
}