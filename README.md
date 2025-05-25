# Relearn - Educational AI Chatbot

An AI chatbot that helps you learn better.

## Features

- **Tutoring**
  - Personalized explanations
  - Adaptive difficulty
  - Quick answers to questions
- **Knowledge**
  - Educational content library
  - Learning paths
- **Visualizations**
  - Mermaid diagrams for flowcharts, sequence diagrams, and more
  - D3.js visualizations for data-driven graphics and charts
- **Interactive**
  - Practice exercises
  - Feedback on answers
  - Visual aids and diagrams
  - Data visualizations with D3.js
- **Interface**
  - Dark/light mode
  - Mobile friendly
  - Chat-based interaction

## Demo

A live demo of Relearn is coming soon. Stay tuned for updates!

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   OPENAI_API_KEY=[INSERT YOUR OPENAI API KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

   The `OPENAI_API_KEY` is required for the AI chat functionality. You can obtain an API key from the Alibaba Dashscope API or OpenAI.

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

We value your feedback! If you have any suggestions, questions, or issues with Relearn, please reach out to our team.

## Visualization Features

### Mermaid Diagrams
Relearn supports Mermaid diagrams for creating various types of visualizations:
- Flowcharts
- Sequence diagrams
- Class diagrams
- Entity-relationship diagrams
- State diagrams
- Gantt charts

To create a Mermaid diagram, use the following syntax in your messages:

```
```mermaid
flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
```
```

### D3.js Visualizations
Relearn now supports D3.js for creating rich, interactive data visualizations:
- Bar charts
- Line charts
- Pie charts
- Scatter plots
- And many more custom visualizations

To create a D3.js visualization, use the following syntax in your messages:

```
```d3
// Your D3.js code here
const data = [10, 20, 30, 40, 50];
const svg = d3.select(d3Container)
  .append("svg")
  .attr("width", 500)
  .attr("height", 300);
// More D3.js code...
```
```

The AI will automatically detect when to use Mermaid or D3.js based on the visualization needs in your prompt.

## About

Built for the Alibaba GenAI Hackathon. This project explores how AI can help students learn more effectively.
