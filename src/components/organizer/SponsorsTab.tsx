"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { GlassButton } from "@/components/ui/glass-button";
import { Package, DollarSign, FileText, CheckCircle2, Clock, Users, Eye } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { getOrganizerSponsors } from "@/context/demoStore";
import { buildRoute } from "@/lib/routes";

interface SponsorsTabProps {
  language: "ar" | "en";
}

export default function SponsorsTab({ language }: SponsorsTabProps) {
  const router = useRouter();
  const sponsorsData = useMemo(() => getOrganizerSponsors("org-1"), []);

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "الحزم المتاحة" : "Available Packages"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">{sponsorsData.packages.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-blue)]/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-[var(--apple-blue)]" />
            </div>
          </div>
        </LiquidGlassCard>
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "الصفقات المدفوعة" : "Paid Deals"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">
                {sponsorsData.deals.filter((d) => d.status === "paid").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[var(--apple-green)]" />
            </div>
          </div>
        </LiquidGlassCard>
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "الإفصاحات المعتمدة" : "Approved Disclosures"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">
                {sponsorsData.disclosures.filter((d) => d.status === "approved").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-[var(--apple-green)]" />
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Sponsorship Packages */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-5 w-5 text-[var(--apple-blue)]" />
          <h2 className="text-xl font-semibold text-[var(--label)]">
            {language === "ar" ? "حزم الرعاية" : "Sponsorship Packages"}
          </h2>
        </div>

        {sponsorsData.packages.length === 0 ? (
          <EmptyState
            title={language === "ar" ? "لا توجد حزم رعاية" : "No sponsorship packages"}
            description={language === "ar" ? "أنشئ حزم رعاية للفعاليات التي تحتاج رعاية" : "Create sponsorship packages for events that need sponsorship"}
            icon={Package}
          />
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {sponsorsData.packages.map((pkg) => (
              <LiquidGlassCard key={pkg.id} blurIntensity="md" interactive={false} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-[var(--label)]">{pkg.title}</h3>
                    <Badge variant={pkg.spotsRemaining > 0 ? "default" : "outline"}>
                      {pkg.spotsRemaining > 0
                        ? language === "ar" ? "متاح" : "Available"
                        : language === "ar" ? "مباع" : "Sold"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--apple-green)]" />
                    <p className="text-lg font-bold text-[var(--label)]">{pkg.priceSAR.toLocaleString()} SAR</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--secondary-label)]">
                      {language === "ar" ? "المزايا" : "Benefits"}:
                    </p>
                    <ul className="text-sm text-[var(--label)] space-y-1">
                      {pkg.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-[var(--apple-green)] flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--system-fill)]">
                    <p className="text-xs text-[var(--secondary-label)]">
                      {pkg.spotsRemaining} / {pkg.spotsTotal} {language === "ar" ? "متاح" : "available"}
                    </p>
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        )}
      </LiquidGlassCard>

      {/* Deals */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="h-5 w-5 text-[var(--apple-green)]" />
          <h2 className="text-xl font-semibold text-[var(--label)]">
            {language === "ar" ? "الصفقات" : "Deals"}
          </h2>
        </div>

        {sponsorsData.deals.length === 0 ? (
          <EmptyState
            title={language === "ar" ? "لا توجد صفقات" : "No deals"}
            description={language === "ar" ? "ستظهر الصفقات هنا عند شراء الرعاة للحزم" : "Deals will appear here when sponsors purchase packages"}
            icon={DollarSign}
          />
        ) : (
          <div className="space-y-3">
            {sponsorsData.deals.map((deal) => {
              const disclosure = sponsorsData.disclosures.find((d) => d.dealId === deal.id);
              return (
                <LiquidGlassCard key={deal.id} blurIntensity="md" interactive={false} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-[var(--label)]">
                          {language === "ar" ? "صفقة الرعاية" : "Sponsorship Deal"}
                        </h3>
                        <Badge
                          variant={deal.status === "paid" ? "default" : "outline"}
                          className={
                            deal.status === "paid"
                              ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                              : ""
                          }
                        >
                          {deal.status === "paid"
                            ? language === "ar" ? "مدفوع" : "Paid"
                            : language === "ar" ? "محجوز" : "Reserved"}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--secondary-label)]">
                        {language === "ar" ? "تم الإنشاء" : "Created"}: {new Date(deal.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                      </p>
                      {deal.paidAt && (
                        <p className="text-xs text-[var(--secondary-label)]">
                          {language === "ar" ? "تم الدفع" : "Paid"}: {new Date(deal.paidAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                        </p>
                      )}
                      {disclosure && (
                        <div className="mt-2 pt-2 border-t border-[var(--system-fill)]">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[var(--apple-blue)]" />
                            <Badge
                              variant={disclosure.status === "approved" ? "default" : "outline"}
                              className={
                                disclosure.status === "approved"
                                  ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                                  : ""
                              }
                            >
                              {disclosure.status === "approved"
                                ? language === "ar" ? "معتمد" : "Approved"
                                : language === "ar" ? "مقدم" : "Submitted"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </LiquidGlassCard>
              );
            })}
          </div>
        )}
      </LiquidGlassCard>

      {/* Disclosures */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-[var(--apple-blue)]" />
          <h2 className="text-xl font-semibold text-[var(--label)]">
            {language === "ar" ? "الإفصاحات" : "Disclosures"}
          </h2>
        </div>

        {sponsorsData.disclosures.length === 0 ? (
          <EmptyState
            title={language === "ar" ? "لا توجد إفصاحات" : "No disclosures"}
            description={language === "ar" ? "ستظهر الإفصاحات هنا عند تقديمها من قبل الرعاة" : "Disclosures will appear here when submitted by sponsors"}
            icon={FileText}
          />
        ) : (
          <div className="space-y-3">
            {sponsorsData.disclosures.map((disclosure) => (
              <LiquidGlassCard key={disclosure.id} blurIntensity="md" interactive={false} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--label)]">
                        {language === "ar" ? "إفصاح الرعاية" : "Sponsorship Disclosure"}
                      </h3>
                      <Badge
                        variant={disclosure.status === "approved" ? "default" : disclosure.status === "submitted" ? "outline" : "outline"}
                        className={
                          disclosure.status === "approved"
                            ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                            : disclosure.status === "submitted"
                            ? "bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/20"
                            : ""
                        }
                      >
                        {disclosure.status === "approved"
                          ? language === "ar" ? "معتمد" : "Approved"
                          : disclosure.status === "submitted"
                          ? language === "ar" ? "مقدم" : "Submitted"
                          : language === "ar" ? "مرفوض" : "Returned"}
                      </Badge>
                    </div>
                    <p className="text-xs text-[var(--secondary-label)]">
                      {language === "ar" ? "تم التقديم" : "Submitted"}: {new Date(disclosure.submittedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                    </p>
                    {disclosure.approvedAt && (
                      <p className="text-xs text-[var(--secondary-label)]">
                        {language === "ar" ? "تم الاعتماد" : "Approved"}: {new Date(disclosure.approvedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                      </p>
                    )}
                    {disclosure.notes && (
                      <p className="text-sm text-[var(--label)] mt-2">{disclosure.notes}</p>
                    )}
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        )}
      </LiquidGlassCard>
    </div>
  );
}

