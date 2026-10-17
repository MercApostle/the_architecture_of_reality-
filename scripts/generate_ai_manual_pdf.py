#!/usr/bin/env python3
import os
import sys
import markdown
import weasyprint

def generate_ai_pdf():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    manual_md_path = os.path.join(project_dir, "WEBSITE_AI_OPERATING_SYSTEM_MANUAL.md")
    output_dir = os.path.join(project_dir, "public", "pdfs")
    os.makedirs(output_dir, exist_ok=True)
    output_pdf_path = os.path.join(output_dir, "The_Architecture_of_Reality_AI_Operating_System_Manual.pdf")

    print(f"📖 Reading markdown manual from: {manual_md_path}")
    with open(manual_md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Convert Markdown to HTML
    html_content = markdown.markdown(md_text, extensions=['tables', 'fenced_code', 'nl2br'])

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Architecture of Reality · Tactical Operating Manual &amp; AI Systems</title>
  <style>
    @page {{
      size: letter;
      margin: 18mm 15mm 18mm 15mm;
      background-color: #07080a;
      @top-left {{
        content: "THE ARCHITECTURE OF REALITY";
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 7pt;
        letter-spacing: 0.2em;
        color: #d4af37;
        font-weight: 600;
        text-transform: uppercase;
      }}
      @top-right {{
        content: "TACTICAL OPERATING MANUAL & AI SYSTEMS (V2.0)";
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 7pt;
        letter-spacing: 0.15em;
        color: #94a3b8;
        font-weight: 500;
        text-transform: uppercase;
      }}
      @bottom-left {{
        content: "CONFIDENTIAL & PROPRIETARY · WRITTEN FOR JEREMY ASHE";
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 6.5pt;
        letter-spacing: 0.1em;
        color: #64748b;
      }}
      @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 7pt;
        color: #d4af37;
        font-weight: 600;
      }}
    }}

    @page:first {{
      margin: 0;
      background-color: #07080a;
      @top-left {{ content: ""; }}
      @top-right {{ content: ""; }}
      @bottom-left {{ content: ""; }}
      @bottom-right {{ content: ""; }}
    }}

    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #07080a;
      color: #e2e8f0;
      line-height: 1.55;
      font-size: 9.5pt;
      margin: 0;
      padding: 0;
    }}

    /* Cover Page */
    .cover-page {{
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 50mm 25mm 30mm 25mm;
      border: 1px solid rgba(212, 175, 55, 0.3);
      margin: 15mm;
      page-break-after: always;
      position: relative;
      background: radial-gradient(circle at 50% 20%, #151822 0%, #07080a 75%);
    }}

    .cover-badge {{
      display: inline-block;
      border: 1px solid #d4af37;
      color: #d4af37;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      padding: 6px 16px;
      margin-bottom: 25px;
    }}

    .cover-title {{
      font-family: "Georgia", "Times New Roman", serif;
      font-size: 32pt;
      font-weight: 400;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: 0.02em;
      margin: 0 0 15px 0;
    }}

    .cover-subtitle {{
      font-size: 13pt;
      color: #d4af37;
      font-weight: 400;
      letter-spacing: 0.05em;
      margin: 0 0 25px 0;
      line-height: 1.4;
    }}

    .cover-desc {{
      font-size: 10pt;
      color: #94a3b8;
      max-width: 520px;
      line-height: 1.6;
      margin-bottom: 40px;
    }}

    .cover-divider {{
      width: 60px;
      height: 2px;
      background-color: #d4af37;
      margin-bottom: 40px;
    }}

    .cover-footer {{
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }}

    .cover-meta-label {{
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #64748b;
      margin-bottom: 4px;
    }}

    .cover-meta-val {{
      font-size: 9pt;
      font-weight: 600;
      color: #e2e8f0;
    }}

    /* Typography & Hierarchy */
    h1 {{
      font-family: "Georgia", "Times New Roman", serif;
      color: #ffffff;
      font-size: 20pt;
      font-weight: 400;
      letter-spacing: 0.02em;
      margin-top: 0;
      margin-bottom: 8px;
    }}

    h2 {{
      font-family: "Georgia", "Times New Roman", serif;
      color: #ffffff;
      font-size: 14pt;
      font-weight: 400;
      letter-spacing: 0.02em;
      border-bottom: 1px solid rgba(212, 175, 55, 0.4);
      padding-bottom: 6px;
      margin-top: 26px;
      margin-bottom: 14px;
      break-after: avoid;
    }}

    h3 {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #d4af37;
      font-size: 10.5pt;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-top: 18px;
      margin-bottom: 8px;
      break-after: avoid;
    }}

    h4 {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      font-size: 9.5pt;
      font-weight: 600;
      margin-top: 14px;
      margin-bottom: 6px;
      break-after: avoid;
    }}

    p {{
      margin-top: 0;
      margin-bottom: 10px;
      color: #cbd5e1;
    }}

    strong {{
      color: #ffffff;
      font-weight: 600;
    }}

    em {{
      color: #d4af37;
      font-style: italic;
    }}

    a {{
      color: #d4af37;
      text-decoration: none;
    }}

    hr {{
      border: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin: 20px 0;
    }}

    /* Lists */
    ul, ol {{
      margin-top: 0;
      margin-bottom: 12px;
      padding-left: 20px;
    }}

    li {{
      margin-bottom: 5px;
      color: #cbd5e1;
    }}

    /* Code Blocks & Pre */
    pre {{
      background-color: #11141c;
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-left: 3px solid #d4af37;
      padding: 10px 14px;
      border-radius: 4px;
      font-family: "Courier New", Courier, monospace;
      font-size: 8pt;
      line-height: 1.4;
      color: #f1f5f9;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 12px 0;
      page-break-inside: avoid;
    }}

    code {{
      background-color: rgba(255, 255, 255, 0.08);
      color: #d4af37;
      padding: 2px 5px;
      border-radius: 3px;
      font-family: "Courier New", Courier, monospace;
      font-size: 8.5pt;
    }}

    pre code {{
      background-color: transparent;
      color: #f1f5f9;
      padding: 0;
    }}

    /* Tables */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 8pt;
      page-break-inside: avoid;
    }}

    th {{
      background-color: #151922;
      color: #d4af37;
      font-weight: 600;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-size: 7pt;
    }}

    td {{
      padding: 6px 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      background-color: #0c0e14;
    }}

    tr {{
      page-break-inside: avoid;
    }}

    tr:nth-child(even) td {{
      background-color: #11141c;
    }}
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div>
      <div class="cover-badge">Systems &amp; AI Operating Protocol</div>
      <div class="cover-title">THE ARCHITECTURE<br>OF REALITY</div>
      <div class="cover-subtitle">Tactical Operating Manual: Website Mastery, AI Workflows &amp; Future-Proof Systems (v2.0)</div>
      <div class="cover-divider"></div>
      <div class="cover-desc">
        The definitive operational field manual for navigating every platform capability, directing AI agentic LLMs and coders, running local offline intelligence, and deploying future-proof software architecture.
      </div>
    </div>

    <div class="cover-footer">
      <div>
        <div class="cover-meta-label">Prepared For</div>
        <div class="cover-meta-val">Jeremy Ashe · Founder &amp; Lead Systems Architect</div>
      </div>
      <div>
        <div class="cover-meta-label">Architecture Platform</div>
        <div class="cover-meta-val">Next.js App Router · Supabase PostgreSQL · Vercel Edge</div>
      </div>
      <div>
        <div class="cover-meta-label">Date &amp; Status</div>
        <div class="cover-meta-val">October 2026 · Systems Active</div>
      </div>
    </div>
  </div>

  <!-- Main Body Content -->
  <div style="padding: 10px 0;">
    {html_content}
  </div>

</body>
</html>
"""

    print("⚙️ Compiling AI Systems PDF with WeasyPrint...")
    weasyprint.HTML(string=full_html).write_pdf(output_pdf_path)
    file_size_kb = os.path.getsize(output_pdf_path) / 1024
    print(f"✅ AI Systems PDF Generated Successfully!")
    print(f"📍 Output File: {output_pdf_path}")
    print(f"📊 File Size: {file_size_kb:.1f} KB")

if __name__ == "__main__":
    generate_ai_pdf()
