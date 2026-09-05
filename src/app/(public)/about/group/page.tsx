import { getContentGateway } from "@/lib/content";

export default async function Page() {
  const gateway = await getContentGateway();
  const profile = await gateway.getGroupProfile();

  return (
    <article className="shell max-w-4xl py-20">
      <p className="eyebrow">The group</p>
      <h1 className="display mt-5 text-6xl">{profile.title}</h1>
      <div className="mt-10 space-y-6 text-lg leading-8 text-[var(--muted)]">
        {profile.body.map((block, index) =>
          block.type === "heading" ? (
            <h2 key={index} className="font-serif text-2xl text-[var(--ink)]">
              {block.text}
            </h2>
          ) : (
            <p key={index}>{block.text}</p>
          ),
        )}
      </div>
    </article>
  );
}
