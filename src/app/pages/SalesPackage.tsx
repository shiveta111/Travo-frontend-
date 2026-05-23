import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  Save,
  Eye,
  Send,
  MapPin,
  Hotel,
  CalendarDays,
  IndianRupee,
  Users,
  Copy,
  Trash2,
} from "lucide-react";

type DayPlan = {
  day: number;
  title: string;
  city: string;
  activities: string;
  stay: string;
  meals: string;
};

type PackageItem = {
  id: string;
  title: string;
  destination: string;
  category: string;
  days: number;
  nights: number;
  price: string;
  hotelType: string;
  transport: string;
  pax: number;
  status: "draft" | "ready" | "shared";
  inclusions: string;
  exclusions: string;
  terms: string;
  dayPlans: DayPlan[];
};

const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: "PKG001",
    title: "Shimla Manali Family Tour",
    destination: "Shimla - Manali",
    category: "Family",
    days: 6,
    nights: 5,
    price: "₹1,24,500",
    hotelType: "3 Star Hotel",
    transport: "Private Cab",
    pax: 4,
    status: "ready",
    inclusions:
      "Hotel stay, breakfast, private cab, sightseeing, toll taxes, parking.",
    exclusions:
      "Airfare/train fare, lunch, dinner, personal expenses, adventure activities.",
    terms:
      "50% advance required. Package price may change based on hotel availability.",
    dayPlans: [
      {
        day: 1,
        title: "Arrival in Shimla",
        city: "Shimla",
        activities:
          "Pickup from Chandigarh and transfer to Shimla. Evening free for Mall Road.",
        stay: "Shimla Hotel",
        meals: "Breakfast",
      },
      {
        day: 2,
        title: "Shimla Local Sightseeing",
        city: "Shimla",
        activities: "Visit Kufri, Jakhu Temple, Ridge and Mall Road.",
        stay: "Shimla Hotel",
        meals: "Breakfast",
      },
      {
        day: 3,
        title: "Shimla to Manali",
        city: "Manali",
        activities:
          "Drive to Manali via Kullu Valley. Visit Kullu shawl factory on the way.",
        stay: "Manali Hotel",
        meals: "Breakfast",
      },
      {
        day: 4,
        title: "Manali Local Sightseeing",
        city: "Manali",
        activities:
          "Visit Hadimba Temple, Vashisht, Club House and Tibetan Monastery.",
        stay: "Manali Hotel",
        meals: "Breakfast",
      },
      {
        day: 5,
        title: "Solang Valley Visit",
        city: "Manali",
        activities:
          "Visit Solang Valley. Optional adventure activities at own cost.",
        stay: "Manali Hotel",
        meals: "Breakfast",
      },
      {
        day: 6,
        title: "Departure",
        city: "Chandigarh",
        activities: "Checkout and drive back to Chandigarh.",
        stay: "No Stay",
        meals: "Breakfast",
      },
    ],
  },
  {
    id: "PKG002",
    title: "Kerala Honeymoon Package",
    destination: "Munnar - Alleppey - Kochi",
    category: "Honeymoon",
    days: 5,
    nights: 4,
    price: "₹98,000",
    hotelType: "4 Star Hotel + Houseboat",
    transport: "Private Cab",
    pax: 2,
    status: "shared",
    inclusions:
      "Hotel stay, houseboat stay, breakfast, private cab and sightseeing.",
    exclusions:
      "Flights, lunch, dinner, personal expenses and monument entry fees.",
    terms:
      "Rooms are subject to availability. Houseboat category depends on final confirmation.",
    dayPlans: [
      {
        day: 1,
        title: "Arrival in Kochi and Transfer to Munnar",
        city: "Munnar",
        activities: "Pickup from Kochi airport and drive to Munnar.",
        stay: "Munnar Hotel",
        meals: "Breakfast",
      },
      {
        day: 2,
        title: "Munnar Sightseeing",
        city: "Munnar",
        activities:
          "Visit Tea Museum, Mattupetty Dam, Echo Point and local market.",
        stay: "Munnar Hotel",
        meals: "Breakfast",
      },
      {
        day: 3,
        title: "Munnar to Alleppey",
        city: "Alleppey",
        activities: "Transfer to Alleppey and check in to houseboat.",
        stay: "Houseboat",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Alleppey to Kochi",
        city: "Kochi",
        activities:
          "Drive to Kochi. Visit Fort Kochi, Marine Drive and Jew Town.",
        stay: "Kochi Hotel",
        meals: "Breakfast",
      },
      {
        day: 5,
        title: "Departure",
        city: "Kochi",
        activities: "Checkout and airport drop.",
        stay: "No Stay",
        meals: "Breakfast",
      },
    ],
  },
];

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    ready: "bg-green-100 text-green-700",
    shared: "bg-indigo-100 text-indigo-700",
  };

  return map[status] || "bg-gray-100 text-gray-700";
};

export function SalesPackage() {
  const [packages, setPackages] = useState<PackageItem[]>(INITIAL_PACKAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [viewPackage, setViewPackage] = useState<PackageItem | null>(null);

  const [packageForm, setPackageForm] = useState({
    title: "",
    destination: "",
    category: "Family",
    days: 5,
    nights: 4,
    price: "",
    hotelType: "",
    transport: "",
    pax: 2,
    inclusions: "",
    exclusions: "",
    terms: "",
    dayPlans: [
      {
        day: 1,
        title: "",
        city: "",
        activities: "",
        stay: "",
        meals: "",
      },
    ] as DayPlan[],
  });

  const filteredPackages = packages.filter((pkg) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      pkg.title.toLowerCase().includes(search) ||
      pkg.destination.toLowerCase().includes(search) ||
      pkg.id.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === "all" || pkg.category === categoryFilter;

    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = useMemo(() => {
    return {
      total: packages.length,
      ready: packages.filter((p) => p.status === "ready").length,
      shared: packages.filter((p) => p.status === "shared").length,
      draft: packages.filter((p) => p.status === "draft").length,
    };
  }, [packages]);

  const resetForm = () => {
    setPackageForm({
      title: "",
      destination: "",
      category: "Family",
      days: 5,
      nights: 4,
      price: "",
      hotelType: "",
      transport: "",
      pax: 2,
      inclusions: "",
      exclusions: "",
      terms: "",
      dayPlans: [
        {
          day: 1,
          title: "",
          city: "",
          activities: "",
          stay: "",
          meals: "",
        },
      ],
    });
  };

  const generateDayPlans = () => {
    const days = Number(packageForm.days || 1);

    const generated = Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      title:
        index === 0
          ? "Arrival"
          : index === days - 1
          ? "Departure"
          : `Day ${index + 1} Sightseeing`,
      city: "",
      activities: "",
      stay: index === days - 1 ? "No Stay" : "",
      meals: "Breakfast",
    }));

    setPackageForm((prev) => ({
      ...prev,
      dayPlans: generated,
    }));
  };

  const updateDayPlan = (
    index: number,
    field: keyof DayPlan,
    value: string | number
  ) => {
    setPackageForm((prev) => {
      const updated = [...prev.dayPlans];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        dayPlans: updated,
      };
    });
  };

  const savePackage = () => {
    if (!packageForm.title || !packageForm.destination || !packageForm.price) {
      alert("Please fill package title, destination and price.");
      return;
    }

    const newPackage: PackageItem = {
      id: `PKG${String(packages.length + 1).padStart(3, "0")}`,
      title: packageForm.title,
      destination: packageForm.destination,
      category: packageForm.category,
      days: Number(packageForm.days),
      nights: Number(packageForm.nights),
      price: packageForm.price,
      hotelType: packageForm.hotelType,
      transport: packageForm.transport,
      pax: Number(packageForm.pax),
      status: "ready",
      inclusions: packageForm.inclusions,
      exclusions: packageForm.exclusions,
      terms: packageForm.terms,
      dayPlans: packageForm.dayPlans,
    };

    setPackages((prev) => [newPackage, ...prev]);
    setShowPackageModal(false);
    resetForm();
  };

  const duplicatePackage = (pkg: PackageItem) => {
    const copied: PackageItem = {
      ...pkg,
      id: `PKG${String(packages.length + 1).padStart(3, "0")}`,
      title: `${pkg.title} Copy`,
      status: "draft",
    };

    setPackages((prev) => [copied, ...prev]);
  };

  const markShared = (pkg: PackageItem) => {
    setPackages((prev) =>
      prev.map((item) =>
        item.id === pkg.id
          ? {
              ...item,
              status: "shared",
            }
          : item
      )
    );
  };

  const deletePackage = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmDelete) return;

    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] overflow-auto">
      <div className="mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Sales Packages
            </h1>
            <p className="text-sm text-muted-foreground">
              Create itinerary templates, tourist packages and ready-to-share
              quotations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search package, destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac] w-[260px]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Categories</option>
              <option value="Family">Family</option>
              <option value="Honeymoon">Honeymoon</option>
              <option value="Adventure">Adventure</option>
              <option value="Luxury">Luxury</option>
              <option value="Group">Group</option>
              <option value="Corporate">Corporate</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="shared">Shared</option>
            </select>

            <button
              onClick={() => setShowPackageModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Create Package</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Packages"
          value={stats.total}
          subtitle="All templates"
        />
        <StatCard
          title="Ready Packages"
          value={stats.ready}
          subtitle="Ready to share"
        />
        <StatCard title="Shared" value={stats.shared} subtitle="Sent to clients" />
        <StatCard title="Drafts" value={stats.draft} subtitle="Need completion" />
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Package Library</h3>
          <p className="text-xs text-muted-foreground">
            Showing {filteredPackages.length} package templates
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="border border-border rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">{pkg.id}</p>
                  <h3 className="text-lg font-semibold text-foreground">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {pkg.destination}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    pkg.status
                  )}`}
                >
                  {pkg.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <MiniInfo
                  icon={<CalendarDays className="w-4 h-4" />}
                  label="Duration"
                  value={`${pkg.days}D / ${pkg.nights}N`}
                />
                <MiniInfo
                  icon={<Users className="w-4 h-4" />}
                  label="Pax"
                  value={`${pkg.pax}`}
                />
                <MiniInfo
                  icon={<Hotel className="w-4 h-4" />}
                  label="Hotel"
                  value={pkg.hotelType || "N/A"}
                />
                <MiniInfo
                  icon={<IndianRupee className="w-4 h-4" />}
                  label="Price"
                  value={pkg.price}
                />
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">
                  First Day Plan
                </p>
                <p className="text-sm text-foreground">
                  {pkg.dayPlans[0]?.title || "N/A"} - {pkg.dayPlans[0]?.activities || "No activity added"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setViewPackage(pkg)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm hover:bg-sidebar-accent"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>

                <button
                  onClick={() => markShared(pkg)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#4b49ac] text-white text-sm hover:bg-[#4b49ac]/90"
                >
                  <Send className="w-4 h-4" />
                  Share
                </button>

                <button
                  onClick={() => duplicatePackage(pkg)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm hover:bg-sidebar-accent"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>

                <button
                  onClick={() => deletePackage(pkg.id)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredPackages.length === 0 && (
            <div className="xl:col-span-2 text-center text-muted-foreground py-10">
              No package found.
            </div>
          )}
        </div>
      </div>

      {showPackageModal && (
        <PackageCreateModal
          packageForm={packageForm}
          setPackageForm={setPackageForm}
          onClose={() => {
            setShowPackageModal(false);
            resetForm();
          }}
          onSave={savePackage}
          generateDayPlans={generateDayPlans}
          updateDayPlan={updateDayPlan}
        />
      )}

      {viewPackage && (
        <PackageViewDrawer
          viewPackage={viewPackage}
          onClose={() => setViewPackage(null)}
          onShare={() => markShared(viewPackage)}
          onDuplicate={() => duplicatePackage(viewPackage)}
        />
      )}
    </div>
  );
}

function PackageCreateModal({
  packageForm,
  setPackageForm,
  onClose,
  onSave,
  generateDayPlans,
  updateDayPlan,
}: {
  packageForm: {
    title: string;
    destination: string;
    category: string;
    days: number;
    nights: number;
    price: string;
    hotelType: string;
    transport: string;
    pax: number;
    inclusions: string;
    exclusions: string;
    terms: string;
    dayPlans: DayPlan[];
  };
  setPackageForm: React.Dispatch<
    React.SetStateAction<{
      title: string;
      destination: string;
      category: string;
      days: number;
      nights: number;
      price: string;
      hotelType: string;
      transport: string;
      pax: number;
      inclusions: string;
      exclusions: string;
      terms: string;
      dayPlans: DayPlan[];
    }>
  >;
  onClose: () => void;
  onSave: () => void;
  generateDayPlans: () => void;
  updateDayPlan: (
    index: number,
    field: keyof DayPlan,
    value: string | number
  ) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[94vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Create New Package
            </h3>
            <p className="text-xs text-muted-foreground">
              Add destination, stay, day-wise itinerary and quotation details.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(94vh-145px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              label="Package Title *"
              value={packageForm.title}
              onChange={(value) =>
                setPackageForm((p) => ({ ...p, title: value }))
              }
              placeholder="Shimla Manali Family Tour"
            />

            <Input
              label="Destination *"
              value={packageForm.destination}
              onChange={(value) =>
                setPackageForm((p) => ({ ...p, destination: value }))
              }
              placeholder="Shimla - Manali"
            />

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Category
              </label>
              <select
                value={packageForm.category}
                onChange={(e) =>
                  setPackageForm((p) => ({
                    ...p,
                    category: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
              >
                <option>Family</option>
                <option>Honeymoon</option>
                <option>Adventure</option>
                <option>Luxury</option>
                <option>Group</option>
                <option>Corporate</option>
              </select>
            </div>

            <Input
              label="Days"
              type="number"
              value={String(packageForm.days)}
              onChange={(value) =>
                setPackageForm((p) => ({
                  ...p,
                  days: Number(value),
                }))
              }
              placeholder="6"
            />

            <Input
              label="Nights"
              type="number"
              value={String(packageForm.nights)}
              onChange={(value) =>
                setPackageForm((p) => ({
                  ...p,
                  nights: Number(value),
                }))
              }
              placeholder="5"
            />

            <Input
              label="Pax"
              type="number"
              value={String(packageForm.pax)}
              onChange={(value) =>
                setPackageForm((p) => ({
                  ...p,
                  pax: Number(value),
                }))
              }
              placeholder="4"
            />

            <Input
              label="Quotation Price *"
              value={packageForm.price}
              onChange={(value) =>
                setPackageForm((p) => ({ ...p, price: value }))
              }
              placeholder="₹1,24,500"
            />

            <Input
              label="Hotel Type"
              value={packageForm.hotelType}
              onChange={(value) =>
                setPackageForm((p) => ({ ...p, hotelType: value }))
              }
              placeholder="3 Star Hotel"
            />

            <Input
              label="Transport"
              value={packageForm.transport}
              onChange={(value) =>
                setPackageForm((p) => ({ ...p, transport: value }))
              }
              placeholder="Private Cab"
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-foreground">
                Day-wise Itinerary
              </h4>
              <p className="text-xs text-muted-foreground">
                Generate days based on package duration and fill details.
              </p>
            </div>

            <button
              onClick={generateDayPlans}
              className="px-4 py-2 bg-[#4b49ac] text-white rounded-lg text-sm hover:bg-[#4b49ac]/90"
            >
              Generate {packageForm.days} Days
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {packageForm.dayPlans.map((day, index) => (
              <div
                key={index}
                className="border border-border rounded-xl p-4 bg-[#f8fafc]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-foreground">
                    Day {day.day}
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Day Title"
                    value={day.title}
                    onChange={(value) => updateDayPlan(index, "title", value)}
                    placeholder="Arrival / Sightseeing / Departure"
                  />

                  <Input
                    label="City"
                    value={day.city}
                    onChange={(value) => updateDayPlan(index, "city", value)}
                    placeholder="Shimla"
                  />

                  <Input
                    label="Stay"
                    value={day.stay}
                    onChange={(value) => updateDayPlan(index, "stay", value)}
                    placeholder="Shimla Hotel"
                  />

                  <Input
                    label="Meals"
                    value={day.meals}
                    onChange={(value) => updateDayPlan(index, "meals", value)}
                    placeholder="Breakfast / Lunch / Dinner"
                  />

                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Activities / Sightseeing
                    </label>
                    <textarea
                      rows={3}
                      value={day.activities}
                      onChange={(e) =>
                        updateDayPlan(index, "activities", e.target.value)
                      }
                      placeholder="Pickup, sightseeing, local market visit, transfer details..."
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Textarea
              label="Inclusions"
              value={packageForm.inclusions}
              onChange={(value) =>
                setPackageForm((p) => ({ ...p, inclusions: value }))
              }
              placeholder="Hotel stay, breakfast, cab, sightseeing..."
            />

            <Textarea
              label="Exclusions"
              value={packageForm.exclusions}
              onChange={(value) =>
                setPackageForm((p) => ({ ...p, exclusions: value }))
              }
              placeholder="Flights, personal expenses, lunch, dinner..."
            />

            <Textarea
              label="Terms & Conditions"
              value={packageForm.terms}
              onChange={(value) =>
                setPackageForm((p) => ({ ...p, terms: value }))
              }
              placeholder="Advance payment, cancellation terms, hotel availability..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-[#f8fafc]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm bg-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg text-sm hover:bg-[#4b49ac]/90"
          >
            <Save className="w-4 h-4" />
            Save Package
          </button>
        </div>
      </div>
    </div>
  );
}

function PackageViewDrawer({
  viewPackage,
  onClose,
  onShare,
  onDuplicate,
}: {
  viewPackage: PackageItem;
  onClose: () => void;
  onShare: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-auto p-6">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground">{viewPackage.id}</p>
            <h3 className="text-xl font-semibold text-foreground">
              {viewPackage.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {viewPackage.destination}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Info
            label="Duration"
            value={`${viewPackage.days} Days / ${viewPackage.nights} Nights`}
          />
          <Info label="Price" value={viewPackage.price} />
          <Info label="Hotel" value={viewPackage.hotelType || "N/A"} />
          <Info label="Transport" value={viewPackage.transport || "N/A"} />
          <Info label="Pax" value={`${viewPackage.pax}`} />
          <Info label="Category" value={viewPackage.category} />
        </div>

        <h4 className="font-semibold text-foreground mb-3">
          Day-wise Itinerary
        </h4>

        <div className="space-y-4 mb-6">
          {viewPackage.dayPlans.map((day) => (
            <div
              key={day.day}
              className="border border-border rounded-lg p-4 bg-[#f8fafc]"
            >
              <h5 className="font-semibold text-foreground mb-1">
                Day {day.day}: {day.title}
              </h5>
              <p className="text-xs text-muted-foreground mb-2">
                City: {day.city || "N/A"} | Stay: {day.stay || "N/A"} | Meals: {day.meals || "N/A"}
              </p>
              <p className="text-sm text-foreground">
                {day.activities || "No activities added."}
              </p>
            </div>
          ))}
        </div>

        <DetailBlock title="Inclusions" value={viewPackage.inclusions} />
        <DetailBlock title="Exclusions" value={viewPackage.exclusions} />
        <DetailBlock title="Terms & Conditions" value={viewPackage.terms} />

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg text-sm"
          >
            <Send className="w-4 h-4" />
            Share Package
          </button>

          <button
            onClick={onDuplicate}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#f8fafc] rounded-lg p-3">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border pb-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

function DetailBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="mb-4">
      <h5 className="font-semibold text-foreground mb-1">{title}</h5>
      <p className="text-sm text-muted-foreground bg-[#f8fafc] rounded-lg p-3">
        {value || "Not added"}
      </p>
    </div>
  );
}
