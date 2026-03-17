"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  type CreateJobPayload,
  useCreateJobMutation,
  useGetAllCategoriesQuery,
} from "@/Redux/Services/JobApi";
import toast from "react-hot-toast";

type CreateJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCompanyId?: string;
};

type PointListInputProps = {
  label: string;
  inputId: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  placeholder: string;
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  className?: string;
};

function PointListInput({
  label,
  inputId,
  inputValue,
  onInputChange,
  placeholder,
  items,
  onAdd,
  onRemove,
  className,
}: PointListInputProps) {
  return (
    <div className={className ?? "grid gap-2"}>
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={inputId}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={onAdd}>
          Add
        </Button>
      </div>
      <div className="flex min-h-8 flex-wrap gap-2">
        {items.map((item, index) => (
          <button
            type="button"
            key={`${item}-${index}`}
            className="rounded-full border px-3 py-1 text-xs"
            onClick={() => onRemove(index)}
          >
            {item} x
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CreateJobDialog({
  open,
  onOpenChange,
  defaultCompanyId = "",
}: CreateJobDialogProps) {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(defaultCompanyId);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("full-time");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState<number>(0);
  const [description, setDescription] = useState("");

  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [whoYouAre, setWhoYouAre] = useState<string[]>([]);
  const [niceToHaves, setNiceToHaves] = useState<string[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);

  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [whoYouAreInput, setWhoYouAreInput] = useState("");
  const [niceToHavesInput, setNiceToHavesInput] = useState("");
  const [requiredSkillInput, setRequiredSkillInput] = useState("");

  const [jobCategories, setJobCategories] = useState("");
  const [appliedCount, setAppliedCount] = useState<number>(0);
  const [totalCapacity, setTotalCapacity] = useState<number>(1);
  const [applyBefore, setApplyBefore] = useState(today);
  const [jobPostedOn, setJobPostedOn] = useState(today);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const categories = categoriesData?.content ?? [];

  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();

  const resetForm = () => {
    setTitle("");
    setCompany(defaultCompanyId);
    setLocation("");
    setType("full-time");
    setExperience("");
    setSalary(0);
    setDescription("");
    setResponsibilities([]);
    setWhoYouAre([]);
    setNiceToHaves([]);
    setRequiredSkills([]);
    setResponsibilityInput("");
    setWhoYouAreInput("");
    setNiceToHavesInput("");
    setRequiredSkillInput("");
    setJobCategories("");
    setAppliedCount(0);
    setTotalCapacity(1);
    setApplyBefore(today);
    setJobPostedOn(today);
  };

  const addItem = (
    input: string,
    setInput: (value: string) => void,
    list: string[],
    setList: (value: string[]) => void
  ) => {
    const value = input.trim();
    if (!value) return;
    if (list.includes(value)) {
      setInput("");
      return;
    }

    setList([...list, value]);
    setInput("");
  };

  const removeItem = (
    index: number,
    list: string[],
    setList: (value: string[]) => void
  ) => {
    setList(list.filter((_, idx) => idx !== index));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!jobCategories) {
      toast.error("Please select a category");
      return;
    }

    if (
      requiredSkills.length === 0 ||
      responsibilities.length === 0 ||
      whoYouAre.length === 0 ||
      niceToHaves.length === 0
    ) {
      toast.error("Please add at least one point in each list field");
      return;
    }

    const payload: CreateJobPayload = {
      title,
      company: company || defaultCompanyId,
      location,
      type,
      experience,
      salary: Number.isFinite(salary) ? salary : 0,
      description,
      responsibilities,
      whoYouAre,
      niceToHaves,
      jobCategories,
      requiredSkills,
      appliedCount: Number.isFinite(appliedCount) ? appliedCount : 0,
      totalCapacity: Number.isFinite(totalCapacity) ? totalCapacity : 0,
      applyBefore,
      jobPostedOn,
    };

    try {
      await createJob(payload).unwrap();
      toast.success("Job created successfully");
      onOpenChange(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create job");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
          Post a New Job
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-175">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Post a New Job</DialogTitle>
            <DialogDescription className="mb-3">
              Fill in all required fields to match the backend job payload.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="job-title">Title</Label>
              <Input
                id="job-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-company">Company (UUID)</Label>
              <Input
                id="job-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-location">Location</Label>
              <Input
                id="job-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-type">Type</Label>
              <Input
                id="job-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="full-time"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-experience">Experience</Label>
              <Input
                id="job-experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-salary">Salary</Label>
              <Input
                id="job-salary"
                type="number"
                min={0}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="job-description">Description</Label>
              <Textarea
                id="job-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-categories">Category</Label>
              <select
                id="job-categories"
                value={jobCategories}
                onChange={(e) => setJobCategories(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
                disabled={isCategoriesLoading}
              >
                <option value="" disabled>
                  {isCategoriesLoading
                    ? "Loading categories..."
                    : "Select a category"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categories || category.content || category.id}
                  </option>
                ))}
              </select>
            </div>

            <PointListInput
              label="Required Skills"
              inputId="job-required-skills"
              inputValue={requiredSkillInput}
              onInputChange={setRequiredSkillInput}
              placeholder="Add required skill"
              items={requiredSkills}
              onAdd={() =>
                addItem(
                  requiredSkillInput,
                  setRequiredSkillInput,
                  requiredSkills,
                  setRequiredSkills
                )
              }
              onRemove={(index) => removeItem(index, requiredSkills, setRequiredSkills)}
            />

            <PointListInput
              label="Responsibilities"
              inputId="job-responsibilities"
              inputValue={responsibilityInput}
              onInputChange={setResponsibilityInput}
              placeholder="Add responsibility point"
              items={responsibilities}
              onAdd={() =>
                addItem(
                  responsibilityInput,
                  setResponsibilityInput,
                  responsibilities,
                  setResponsibilities
                )
              }
              onRemove={(index) =>
                removeItem(index, responsibilities, setResponsibilities)
              }
            />

            <PointListInput
              label="Who You Are"
              inputId="job-who-you-are"
              inputValue={whoYouAreInput}
              onInputChange={setWhoYouAreInput}
              placeholder="Add who-you-are point"
              items={whoYouAre}
              onAdd={() =>
                addItem(whoYouAreInput, setWhoYouAreInput, whoYouAre, setWhoYouAre)
              }
              onRemove={(index) => removeItem(index, whoYouAre, setWhoYouAre)}
            />

            <PointListInput
              label="Nice To Haves"
              inputId="job-nice-to-haves"
              inputValue={niceToHavesInput}
              onInputChange={setNiceToHavesInput}
              placeholder="Add nice-to-have point"
              items={niceToHaves}
              onAdd={() =>
                addItem(
                  niceToHavesInput,
                  setNiceToHavesInput,
                  niceToHaves,
                  setNiceToHaves
                )
              }
              onRemove={(index) => removeItem(index, niceToHaves, setNiceToHaves)}
              className="grid gap-2 md:col-span-2"
            />

            <div className="grid gap-2">
              <Label htmlFor="job-applied-count">Applied Count</Label>
              <Input
                id="job-applied-count"
                type="number"
                min={0}
                value={appliedCount}
                onChange={(e) => setAppliedCount(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-total-capacity">Total Capacity</Label>
              <Input
                id="job-total-capacity"
                type="number"
                min={0}
                value={totalCapacity}
                onChange={(e) => setTotalCapacity(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-apply-before">Apply Before</Label>
              <Input
                id="job-apply-before"
                type="date"
                value={applyBefore}
                onChange={(e) => setApplyBefore(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-posted-on">Job Posted On</Label>
              <Input
                id="job-posted-on"
                type="date"
                value={jobPostedOn}
                onChange={(e) => setJobPostedOn(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </DialogClose>
            {isCreating ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" variant="primary" size="lg">
                Post Job
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
