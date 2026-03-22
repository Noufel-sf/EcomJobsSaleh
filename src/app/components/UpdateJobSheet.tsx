"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  useGetAllCategoriesQuery,
  useUpdateJobMutation,
} from "@/Redux/Services/JobApi";
import { Job } from "@/lib/DatabaseTypes";
import toast from "react-hot-toast";

type UpdateJobSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
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

export default function UpdateJobSheet({
  open,
  onOpenChange,
  job,
}: UpdateJobSheetProps) {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [title, setTitle] = useState(job?.title ?? "");
  const [company] = useState(job?.company ?? "");
  const [description, setDescription] = useState(job?.description ?? "");
  const [location, setLocation] = useState(job?.location ?? "");
  const [type, setType] = useState<Job["type"]>(
    (job?.type as Job["type"]) ?? "full-time",
  );
  const [experience, setExperience] = useState(job?.experience ?? "");

  const initialSalary = Number(job?.salary);
  const [salary, setSalary] = useState<number>(
    Number.isFinite(initialSalary) ? initialSalary : 0,
  );

  const [responsibilities, setResponsibilities] = useState<string[]>(
    job?.responsibilities ?? [],
  );
  const [whoYouAre, setWhoYouAre] = useState<string[]>(job?.whoYouAre ?? []);
  const [niceToHaves, setNiceToHaves] = useState<string[]>(
    job?.niceToHaves ?? [],
  );
  const [requiredSkills, setRequiredSkills] = useState<string[]>(
    job?.requiredSkills ?? [],
  );

  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [whoYouAreInput, setWhoYouAreInput] = useState("");
  const [niceToHavesInput, setNiceToHavesInput] = useState("");
  const [requiredSkillInput, setRequiredSkillInput] = useState("");

  const initialCategory = job?.categories?.[0] ?? "";
  const [jobCategories, setJobCategories] = useState(initialCategory);

  const [totalCapacity, setTotalCapacity] = useState<number>(
    Number.isFinite(job?.totalCapacity) ? (job?.totalCapacity as number) : 1,
  );
  const [applyBefore, setApplyBefore] = useState(job?.applyBefore ?? today);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const categories = categoriesData?.content ?? [];

  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const addItem = (
    input: string,
    setInput: (value: string) => void,
    list: string[],
    setList: (value: string[]) => void,
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
    setList: (value: string[]) => void,
  ) => {
    setList(list.filter((_, idx) => idx !== index));
  };

  const handleUpdate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!job) return;

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

      try {
        const payload = {
          title,
          company,
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
          appliedCount: Number.isFinite(job.appliedCount) ? job.appliedCount : 0,
          totalCapacity: Number.isFinite(totalCapacity) ? totalCapacity : 0,
          applyBefore,
          jobPostedOn: job.jobPostedOn || today,
        };

        await updateJob({
          id: job.id,
          jobData: payload,
        }).unwrap();

        toast.success("Job updated successfully");
        onOpenChange(false);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to update job");
      }
    },
    [
      applyBefore,
      company,
      description,
      experience,
      job,
      jobCategories,
      location,
      niceToHaves,
      onOpenChange,
      requiredSkills,
      responsibilities,
      salary,
      title,
      today,
      totalCapacity,
      type,
      updateJob,
      whoYouAre,
    ],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="">
        <form onSubmit={handleUpdate}>
          <SheetHeader className="">
            <SheetTitle className="">Edit Job</SheetTitle>
            <SheetDescription className="">
              Update the job details. Click save when done.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 px-6 py-4 md:grid-cols-2">
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
                onChange={(e) => setType(e.target.value as Job["type"])}
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
                  setRequiredSkills,
                )
              }
              onRemove={(index) =>
                removeItem(index, requiredSkills, setRequiredSkills)
              }
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
                  setResponsibilities,
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
                addItem(
                  whoYouAreInput,
                  setWhoYouAreInput,
                  whoYouAre,
                  setWhoYouAre,
                )
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
                  setNiceToHaves,
                )
              }
              onRemove={(index) => removeItem(index, niceToHaves, setNiceToHaves)}
              className="grid gap-2 md:col-span-2"
            />

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
          </div>

          <SheetFooter className="space-y-2">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            {isUpdating ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" size="lg" variant="primary" disabled={!job}>
                Save Changes
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
