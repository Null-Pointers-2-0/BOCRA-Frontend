"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Complaints() {
  const complaintsCategories = [
    "SERVICE_QUALITY",
    "BILLING",
    "COVERAGE",
    "CONDUCT",
    "INTERNET",
    "BROADCASTING",
    "POSTAL",
    "OTHER",
  ];
  const priorities = ["LOW", "MEDIUM", "HIGH"];
  const operators = [
    "Mascom",
    "Orange",
    "Botswana Telecommunications Corporation",
    "Jenny Internet",
    "Paratus",
    "Starlink",
    "Other",
  ];

  const [formData, setFormData] = useState<Partial<Complaint>>({
    complaint_name: "",
    complaint_email: "",
    complaint_phone: "",
    against_operator_name: "",
    category: "",
    subject: "",
    description: "",
    priority: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");

  const handleOperatorChange = (value: string | null) => {
    setSelectedOperator(value || "");
  };

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value || "");
  };

  const handlePriorityChange = (value: string | null) => {
    setSelectedPriority(value || "");
  };

  const handleInputChange = (field: keyof Complaint, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Form submitted:", {
      ...formData,
      category: selectedCategory,
      priority: selectedPriority,
      against_operator_name: selectedOperator,
    });
  };

  const complaintsExample = [
    {
      complaint_name: "Kitso Thebe",
      complaint_email: "kitsothebe@gmail.com",
      complaint_phone: "+267 71234567",
      against_operator_name: "Orange",
      category: "BILLING",
      subject: "Billing Problems",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      priority: "HIGH",
    },
    {
      complaint_name: "Kitso Thebe",
      complaint_email: "kitsothebe@gmail.com",
      complaint_phone: "+267 71234567",
      against_operator_name: "Orange",
      category: "BILLING",
      subject: "Billing Problems",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      priority: "HIGH",
    },
    {
      complaint_name: "Kitso Thebe",
      complaint_email: "kitsothebe@gmail.com",
      complaint_phone: "+267 71234567",
      against_operator_name: "Orange",
      category: "BILLING",
      subject: "Billing Problems",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      priority: "HIGH",
    },
    {
      complaint_name: "Kitso Thebe",
      complaint_email: "kitsothebe@gmail.com",
      complaint_phone: "+267 71234567",
      against_operator_name: "Orange",
      category: "BILLING",
      subject: "Billing Problems",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      priority: "HIGH",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col px-6">
        <div className="flex flex-col space-y-4 mt-20 md:mt-30">
          <h1 className="text-3xl font-semibold">File a complaint</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 border border-gray-400 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl"
          >
            <div>
              <label htmlFor="name" className="font-medium text-lg">
                Enter name <span className="text-pink">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Kitso Thebe..."
                autoComplete="true"
                required
                value={formData.complaint_name}
                onChange={(e) =>
                  handleInputChange("complaint_name", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="email" className="font-medium text-lg">
                Enter email address <span className="text-pink">*</span>
              </label>
              <Input
                id="email"
                type="text"
                placeholder="example@gmail.com"
                autoComplete="true"
                required
                value={formData.complaint_email}
                onChange={(e) =>
                  handleInputChange("complaint_email", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="font-medium text-lg">
                Enter phone number
              </label>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="+267 71234567"
                autoComplete="true"
                value={formData.complaint_phone}
                onChange={(e) =>
                  handleInputChange("complaint_phone", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="operatorAgainst" className="font-medium text-lg">
                Select service provider <span className="text-pink">*</span>
              </label>
              <Combobox
                value={selectedOperator}
                onValueChange={handleOperatorChange}
              >
                <ComboboxInput
                  placeholder="Select operator..."
                  showClear={true}
                  required
                />
                <ComboboxContent>
                  <ComboboxList>
                    {operators.map((operator) => (
                      <ComboboxItem
                        key={operator}
                        value={operator}
                        className="hover:bg-turquoise hover:text-white"
                      >
                        {operator}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <div>
              <label htmlFor="category" className="font-medium text-lg">
                Select category <span className="text-pink">*</span>
              </label>
              <Combobox
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <ComboboxInput
                  placeholder="Select a category..."
                  showClear={true}
                  required
                />
                <ComboboxContent>
                  <ComboboxList>
                    {complaintsCategories.map((category) => (
                      <ComboboxItem key={category} value={category}>
                        {category.replace(/_/g, " ").toLowerCase()}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>No category found</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <div>
              <label htmlFor="priority" className="font-medium text-lg">
                Select priority <span className="text-pink">*</span>
              </label>
              <Combobox
                value={selectedPriority}
                onValueChange={handlePriorityChange}
              >
                <ComboboxInput
                  placeholder="Select priority..."
                  showClear={true}
                  required
                />
                <ComboboxContent>
                  <ComboboxList>
                    {priorities.map((priority) => (
                      <ComboboxItem key={priority} value={priority}>
                        {priority.toLowerCase()}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="subject" className="font-medium text-lg">
                Subject <span className="text-pink">*</span>
              </label>
              <Input
                id="subject"
                type="text"
                placeholder="Brief description of your complaint..."
                required
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="font-medium text-lg">
                Detailed description <span className="text-pink">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your complaint..."
                className="border border-gray-400"
                rows={6}
                required
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full hover:bg-turquoise/90 hover:cursor-pointer bg-turquoise text-white text-lg font-medium py-5"
              >
                Submit Complaint
              </Button>
            </div>
          </form>
        <section className="w-full max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold">Recent Complaints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaintsExample.map((complaint, index) => (
              <ComplaintsCard key={index} complaint={complaint} />
            ))}
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
type Complaint = {
  complaint_name: string;
  complaint_email: string;
  complaint_phone: string;
  against_operator_name: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
};

const ComplaintsCard = ({ complaint }: { complaint: Complaint }) => {
  return (
    <div className="bg-gray-50 border border-gray-400 p-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-900">
          {complaint.subject}
        </h3>
        <span
          className={`px-3 py-1 text-xs font-medium ${
            complaint.priority === "HIGH"
              ? "bg-pink text-white"
              : complaint.priority === "MEDIUM"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {complaint.priority}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">From:</span>
          <span>{complaint.complaint_name}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Email:</span>
          <span>{complaint.complaint_email}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Phone:</span>
          <span>{complaint.complaint_phone}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Against:</span>
          <span>{complaint.against_operator_name}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 gap-2">
          <span className="font-medium">Category:</span>
          <span className="px-2 py-1 text-black bg-gray-400 text-xs">
            {complaint.category}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-500">
          <p className="text-lg text-black leading-relaxed">
            {complaint.description}
          </p>
        </div>
      </div>
    </div>
  );
};
