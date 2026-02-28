import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

interface NotionTicketBody {
  summary: string;
  reproductionSteps: string;
  severity: string;
  errorType: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return NextResponse.json(
      { error: "NOTION_API_KEY or NOTION_DATABASE_ID is not configured." },
      { status: 500 }
    );
  }

  const body: NotionTicketBody = await request.json();
  const { summary, reproductionSteps, severity, errorType } = body;

  if (!summary) {
    return NextResponse.json(
      { error: "Summary is required." },
      { status: 400 }
    );
  }

  const notion = new Client({ auth: apiKey });

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Summary: {
          title: [{ text: { content: summary } }],
        },
        Severity: {
          select: { name: severity || "medium" },
        },
        "Error Type": {
          rich_text: [{ text: { content: errorType || "Unknown" } }],
        },
        Status: {
          select: { name: "Open" },
        },
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "Reproduction Steps" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              { type: "text", text: { content: reproductionSteps || "" } },
            ],
          },
        },
      ],
    });

    return NextResponse.json({ success: true, pageId: response.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Notion API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
