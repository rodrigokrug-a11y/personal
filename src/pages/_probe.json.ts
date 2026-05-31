import type { APIRoute } from "astro";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export const GET: APIRoute = async () => {
  const reader = createReader(process.cwd(), keystaticConfig);
  const all = await reader.collections.projects.all();
  const sample = all[0] as any;
  let bodyType = typeof sample?.entry?.bodyPt;
  let bodyResolved: unknown = null;
  try {
    bodyResolved =
      typeof sample?.entry?.bodyPt === "function"
        ? await sample.entry.bodyPt()
        : sample?.entry?.bodyPt;
  } catch (e) {
    bodyResolved = "ERR:" + (e as Error).message;
  }
  return new Response(
    JSON.stringify(
      {
        count: all.length,
        topLevelKeys: sample ? Object.keys(sample) : [],
        entryKeys: sample?.entry ? Object.keys(sample.entry) : [],
        slug: sample?.slug,
        name: sample?.entry?.name,
        order: sample?.entry?.order,
        tagline: sample?.entry?.tagline,
        tags: sample?.entry?.tags,
        bodyType,
        bodyResolvedSample: JSON.stringify(bodyResolved).slice(0, 400),
        allSlugs: all.map((x: any) => x.slug),
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
