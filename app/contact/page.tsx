import InterestForm from "@/components/forms/InterestForm";

export default function MyContactPage() {
    return (
<section className="py-16">
<div className="container mx-auto">
  <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
  Questions? I’m Here to Help!
  </h2>
  <InterestForm />
</div>
</section>
);
}