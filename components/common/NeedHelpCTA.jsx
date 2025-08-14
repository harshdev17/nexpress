import Link from "next/link";

export default function NeedHelpCTA() {
  return (
    <div className="mt-12 p-5 md:p-6 rounded-2xl border border-[#368899]/20 bg-gradient-to-r from-[#e0f2fe] to-[#f0fdfa]">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
      <p className="text-gray-700">
        Call {" "}
        <a href="tel:+442084450589" className="text-[#368899] hover:underline">020 8445 0589</a>
        {" "}or{" "}
        <a href="tel:+442084450680" className="text-[#368899] hover:underline">020 8445 0680</a>
        , or {" "}
        <Link href="/contact" className="text-[#368899] hover:underline">send us a message</Link>.
      </p>
    </div>
  );
}
