"use client";

import { Bookmark, Building2, MapPin, SlidersHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CompareTray } from "@/components/college/compare-tray";
import { AppLayout } from "@/components/college/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  cityOptions,
  collegeTypeOptions,
  colleges,
  courseOptions,
  formatINR,
  formatLPA,
  placementPreferences,
  stateOptions,
  type College,
} from "@/lib/college-data";
import { filterColleges, sortColleges, sortOptions, type SortOption } from "@/lib/college-filters";
import { compareState, defaultSearchFilters, searchState, wishlistState, type SearchFilters } from "@/lib/college-state";

export default function CollegesPage() {
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [wishIds, setWishIds] = useState<number[]>([]);

  useEffect(() => {
    setFilters(searchState.get());
    setCompareIds(compareState.get());
    setWishIds(wishlistState.get());
  }, []);

  const filtered = useMemo(() => sortColleges(filterColleges(colleges, filters), sortBy), [filters, sortBy]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onApplyFilters = () => {
    searchState.set(filters);
    toast.success("Filters applied");
  };

  const onToggleCompare = (id: number, checked: boolean) => {
    const next = checked ? [...new Set([...compareIds, id])] : compareIds.filter((item) => item !== id);
    if (next.length > 3) {
      toast.error("You can compare up to 3 colleges.");
      return;
    }
    setCompareIds(next);
    compareState.set(next);
  };

  const onToggleWishlist = (id: number) => {
    const exists = wishIds.includes(id);
    const next = exists ? wishIds.filter((item) => item !== id) : [...wishIds, id];
    setWishIds(next);
    wishlistState.set(next);
  };

  return (
    <AppLayout>
      <div className="relative min-h-[calc(100vh-7rem)] w-full overflow-visible bg-[#101f21] px-4 py-6 text-[#f7efd9] sm:px-6 md:h-[calc(100vh-8rem)] md:min-h-0 md:overflow-hidden lg:px-8">
        <div className="pointer-events-none absolute -left-28 top-28 h-[360px] w-[360px] rounded-full border-[46px] border-[#314244]/45" />
        <div className="pointer-events-none absolute -right-28 bottom-[-120px] h-[360px] w-[360px] rounded-full border-[46px] border-[#314244]/45" />
        <div className="pointer-events-none absolute left-5 top-8 h-52 w-40 opacity-30 [background-image:radial-gradient(#d6c091_1.5px,transparent_1.5px)] [background-size:14px_14px]" />

        <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col overflow-hidden px-2 sm:px-4">
          <div className="mb-4 shrink-0 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:pl-1">
            <div className="flex items-baseline gap-2 whitespace-nowrap sm:block">
              <h1 className="text-2xl font-semibold text-[#f7efd9]">Colleges |</h1>
              <p className="text-sm text-[#d8cfb8]">Showing {filtered.length} colleges</p>
            </div>

            <div className="inline-flex w-full items-center gap-2 rounded-lg border border-[#d6c091]/25 bg-[#213033]/80 p-2 text-sm sm:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-[#d6c091]" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="h-8 flex-1 border-none bg-transparent text-[#f7efd9] shadow-none sm:w-52 sm:flex-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid flex-1 min-h-0 overflow-hidden gap-5 lg:grid-cols-[270px_1fr] xl:grid-cols-[300px_1fr]">
            <aside className="h-full overflow-hidden rounded-2xl border border-[#d6c091]/20 bg-[#243436]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="h-full min-h-0 overflow-y-auto overflow-x-hidden pr-2">
  <div className="space-y-4 pb-6">
                <FilterSelect
                  label="Course"
                  value={filters.course}
                  onChange={(value) => updateFilter("course", value as SearchFilters["course"])}
                  options={courseOptions}
                />

                <FilterSelect
                  label="State"
                  value={filters.state}
                  onChange={(value) => {
                    updateFilter("state", value);
                    updateFilter("city", "");
                  }}
                  options={["Any", ...stateOptions]}
                />

                <FilterSelect
                  label="City"
                  value={filters.city}
                  onChange={(value) => updateFilter("city", value)}
                  options={[
                    "Any",
                    ...Array.from(
                      new Set(
                        colleges
                          .filter((college) => !filters.state || college.state === filters.state)
                          .map((college) => college.city),
                      ),
                    ),
                  ]}
                />

                <FilterSelect
                  label="Placement Filter"
                  value={filters.placementPreference}
                  onChange={(value) => updateFilter("placementPreference", value as SearchFilters["placementPreference"])}
                  options={placementPreferences}
                />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#f7efd9]">Budget Range (Annual)</p>
                  <div className="flex items-center justify-between text-xs text-[#d8cfb8]">
                    <span>₹50K</span>
                    <span>₹20L</span>
                  </div>
                  <Slider
                    value={[filters.budget]}
                    min={50000}
                    max={2000000}
                    step={25000}
                    onValueChange={(value) => updateFilter("budget", value[0])}
                  />
                  <Badge className="rounded-md bg-[#d6c091] text-[#172325] hover:bg-[#d6c091]">
                    Selected: ₹{filters.budget.toLocaleString("en-IN")}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#f7efd9]">College Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {collegeTypeOptions.map((type) => (
                      <label
                        key={type}
                        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                          filters.collegeTypes.includes(type)
                            ? "border-[#d6c091] bg-[#1d706d] text-white"
                            : "border-[#d6c091]/30 bg-[#f7efd9] text-[#172325]"
                        }`}
                      >
                        <Checkbox
                          className="hidden"
                          checked={filters.collegeTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            const enabled = checked === true;
                            updateFilter(
                              "collegeTypes",
                              enabled
                                ? [...filters.collegeTypes, type]
                                : filters.collegeTypes.filter((item) => item !== type),
                            );
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-sm font-medium text-[#f7efd9]">
                  <Checkbox
                    checked={filters.scholarshipOnly}
                    onCheckedChange={(value) => updateFilter("scholarshipOnly", value === true)}
                  />
                  Scholarship Available
                </label>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <Button className="w-full rounded-xl bg-[#1d706d] text-white hover:bg-[#185d5a]" onClick={onApplyFilters}>
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-[#d6c091]/40 bg-transparent text-[#f7efd9] hover:bg-[#f7efd9] hover:text-[#172325]"
                    onClick={() => {
                      setFilters(defaultSearchFilters);
                      searchState.set(defaultSearchFilters);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              </div>
            </aside>

            <div className="h-full min-h-0 space-y-4 overflow-y-auto overflow-x-hidden pr-2">
              {filtered.map((college) => (
                <CollegeListCard
                  key={college.id}
                  college={college}
                  compared={compareIds.includes(college.id)}
                  wished={wishIds.includes(college.id)}
                  onToggleCompare={onToggleCompare}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}

              {filtered.length === 0 ? (
                <div className="rounded-xl border border-[#d6c091]/20 bg-[#243436]/80 p-6 text-center text-[#d8cfb8]">
                  No colleges found for current filters. Try adjusting budget, location, or placement preferences.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <CompareTray count={compareIds.length} />
      </div>
    </AppLayout>
  );
}

function CollegeListCard({
  college,
  compared,
  wished,
  onToggleCompare,
  onToggleWishlist,
}: {
  college: College;
  compared: boolean;
  wished: boolean;
  onToggleCompare: (id: number, checked: boolean) => void;
  onToggleWishlist: (id: number) => void;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[#d8cdaa] bg-[#f3e8c9] p-3 text-[#172325] shadow-lg shadow-black/25 sm:p-4">
      <div className="pointer-events-none absolute -right-12 -top-20 h-44 w-44 rounded-full bg-[#e2d3aa]" />
      <div className="pointer-events-none absolute -bottom-20 left-3 h-32 w-44 rounded-full bg-[#e2d3aa]/60" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-40 opacity-20 [background-image:radial-gradient(#85764e_1px,transparent_1px)] [background-size:10px_10px]" />

      <div className="relative grid gap-4 md:grid-cols-[260px_1fr]">
        <img
          src={college.image}
          alt={`${college.name} campus`}
          className="h-44 w-full rounded-xl object-cover md:h-40"
          loading="lazy"
          width={1280}
          height={832}
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-xl font-bold text-[#172325]">{college.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-[#536062]">
                <MapPin className="h-4 w-4" />
                {college.city}, {college.state} • {college.collegeType}
              </p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-lg bg-[#e0cf9f] px-3 py-1 text-sm font-bold text-[#172325]">
              <Star className="h-4 w-4 fill-[#1d706d] text-[#1d706d]" />
              {college.rating}/5
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="rounded-md bg-[#efe4c8] px-3 py-1 text-xs text-[#172325] hover:bg-[#efe4c8]">{college.course}</Badge>
            {college.scholarshipAvailable ? (
              <Badge className="rounded-md bg-[#1d706d] px-3 py-1 text-xs text-white hover:bg-[#1d706d]">Scholarship Available</Badge>
            ) : null}
            {college.accreditation.slice(0, 2).map((item) => (
              <Badge key={item} className="rounded-md bg-[#efe4c8] px-3 py-1 text-xs text-[#172325] hover:bg-[#efe4c8]">
                {item}
              </Badge>
            ))}
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <ResultMetric label="Annual Cost" value={formatINR(college.annualCost)} />
            <ResultMetric label="Average Package" value={formatLPA(college.averagePackageLpa)} />
            <ResultMetric label="Highest Package" value={formatLPA(college.highestPackageLpa)} />
            <ResultMetric label="Placement Rate" value={`${college.placementRate}%`} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-[#536062]">
              <Checkbox checked={compared} onCheckedChange={(value) => onToggleCompare(college.id, value === true)} />
              Compare
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`grid h-10 w-10 place-items-center rounded-lg border border-[#1d706d]/30 ${
                  wished ? "bg-[#1d706d] text-white" : "bg-[#1d706d] text-[#f7efd9]"
                }`}
                onClick={() => onToggleWishlist(college.id)}
                aria-label="Save college"
              >
                <Bookmark className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
              </button>
              <Link href={`/college/${college.slug}`}>
                <Button className="h-10 gap-2 rounded-lg bg-[#b69858] px-4 text-[#172325] hover:bg-[#a98848]">
                  <Building2 className="h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#536062]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#172325]">{value}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const current = value || "Any";
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-semibold text-[#f7efd9]">{label}</p>
      <Select value={current} onValueChange={(next) => onChange(next === "Any" ? "" : next)}>
        <SelectTrigger className="h-11 rounded-lg border-[#d6c091]/25 bg-white/10 text-[#f7efd9] shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
