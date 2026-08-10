"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, Sparkles, Zap, Shield, ChevronRight, Activity, Crosshair, Fingerprint, Database, Network } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <AppLayout>
      <div className="flex-1 w-full overflow-y-auto bg-white text-slate-900 pb-24">
        
        {/* HERO SECTION */}
        <div className="pt-16 pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>CareerScope Plans</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
                Simple, transparent pricing
              </h1>
              
              <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                Choose the plan that fits your career goals. Whether you are casually looking or actively hunting for your dream job.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4">
                <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                <button 
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full bg-slate-200 transition-colors focus:outline-none"
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Annually</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Save 20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            
            {/* Free Plan */}
            <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                <p className="text-slate-500 text-sm">For casual job seekers who need basic tracking.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <FeatureItem text="Search & Filter Jobs" icon={<Check className="w-5 h-5 text-slate-400" />} />
                <FeatureItem text="Manual Application Tracking" icon={<Check className="w-5 h-5 text-slate-400" />} />
                <FeatureItem text="Track up to 3 Companies" icon={<Check className="w-5 h-5 text-slate-400" />} />
                <FeatureItem text="Standard Newsfeed" icon={<Check className="w-5 h-5 text-slate-400" />} />
                <FeatureItem text="1 Skill Gap Analysis per week" icon={<Check className="w-5 h-5 text-slate-400" />} />
              </ul>
              <button className="w-full py-3 px-6 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors">
                Start Free
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="rounded-2xl bg-white border-2 border-cyan-600 p-8 shadow-lg relative transform lg:-translate-y-2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-cyan-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <div className="mb-6 mt-2">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                <p className="text-slate-500 text-sm">For active job hunters needing smart tools.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-slate-900">
                  ${isAnnual ? '12' : '15'}
                </span>
                <span className="text-slate-500">/month</span>
                {isAnnual && <div className="text-amber-600 text-sm mt-1">Billed $144 yearly</div>}
              </div>
              <ul className="space-y-4 mb-8">
                <FeatureItem text="Unlimited Skill Gap Analysis" icon={<Check className="w-5 h-5 text-cyan-600" />} />
                <FeatureItem text="Smart Application Tracker" icon={<Check className="w-5 h-5 text-cyan-600" />} />
                <FeatureItem text="Unlimited Company Tracking" icon={<Check className="w-5 h-5 text-cyan-600" />} />
                <FeatureItem text="Live Job Match Scoring" icon={<Check className="w-5 h-5 text-cyan-600" />} />
                <FeatureItem text="Interview Prep Intelligence" icon={<Check className="w-5 h-5 text-cyan-600" />} />
                <FeatureItem text="Priority Newsfeed Access" icon={<Check className="w-5 h-5 text-cyan-600" />} />
              </ul>
              <button className="w-full py-3 px-6 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors flex items-center justify-center gap-2">
                Upgrade to Pro <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Premium Plan */}
            <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
               <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium</h3>
                <p className="text-slate-500 text-sm">For those who want AI to do the heavy lifting.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-slate-900">
                  ${isAnnual ? '33' : '39'}
                </span>
                <span className="text-slate-500">/month</span>
                {isAnnual && <div className="text-amber-600 text-sm mt-1">Billed $399 yearly</div>}
              </div>
              <ul className="space-y-4 mb-8">
                <FeatureItem text="Everything in Pro" icon={<Check className="w-5 h-5 text-amber-500" />} />
                <FeatureItem text="Automatic Job Applications" icon={<Check className="w-5 h-5 text-amber-500" />} />
                <FeatureItem text="Find Recruiter Emails" icon={<Check className="w-5 h-5 text-amber-500" />} />
                <FeatureItem text="AI Cover Email Drafting" icon={<Check className="w-5 h-5 text-amber-500" />} />
                <FeatureItem text="Inbox Parsing for Feedback" icon={<Check className="w-5 h-5 text-amber-500" />} />
              </ul>
              <button className="w-full py-3 px-6 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors">
                Apply for Premium
              </button>
            </div>
          </div>
        </div>

        {/* FEATURE COMPARISON */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">Feature Comparison</h2>
              <p className="text-slate-600">See exactly what you get with each plan.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Feature</th>
                    <th className="px-6 py-4 text-center">Free</th>
                    <th className="px-6 py-4 text-center text-cyan-700">Pro</th>
                    <th className="px-6 py-4 text-center text-amber-600">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <ComparisonRow title="Job Listing Aggregator" free="Search Only" pro="Advanced Filters" premium="Full API Access" />
                  <ComparisonRow title="Application Tracking" free="Manual" pro="Smart AI Tracker" premium="Automatic" />
                  <ComparisonRow title="Skill Gap Analysis" free="1 per week" pro="Unlimited" premium="Unlimited" />
                  <ComparisonRow title="Target Companies" free="Up to 3" pro="Unlimited" premium="Unlimited" />
                  <ComparisonRow title="Interview Prep" free={<X className="w-5 h-5 mx-auto text-slate-300"/>} pro={<Check className="w-5 h-5 mx-auto text-cyan-600"/>} premium={<Check className="w-5 h-5 mx-auto text-amber-500"/>} />
                  <ComparisonRow title="Recruiter Outreach emails" free={<X className="w-5 h-5 mx-auto text-slate-300"/>} pro={<X className="w-5 h-5 mx-auto text-slate-300"/>} premium={<Check className="w-5 h-5 mx-auto text-amber-500"/>} />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="container mx-auto px-6 pt-12">
          <div className="max-w-4xl mx-auto rounded-2xl bg-slate-50 border border-slate-200 p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Ready to boost your career?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Join professionals using AI to accelerate their job search and career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-6 py-3 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                  Start Free Today <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

function FeatureItem({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <span className="text-slate-600 leading-snug">{text}</span>
    </li>
  );
}

function ComparisonRow({ title, free, pro, premium }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900">{title}</td>
      <td className="px-6 py-4 text-center">{free}</td>
      <td className="px-6 py-4 text-center bg-cyan-50/30">{pro}</td>
      <td className="px-6 py-4 text-center bg-amber-50/30">{premium}</td>
    </tr>
  );
}
