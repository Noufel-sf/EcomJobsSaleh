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
import { type Language, useI18n } from "@/context/I18nContext";
import toast from "react-hot-toast";

type CreateJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCompanyId?: string;
};

type PointListInputProps = {
  label: string;
  addLabel: string;
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
  addLabel,
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
          {addLabel}
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
  const { language } = useI18n();
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const createJobCopy: Record<Language, Record<string, string>> = {
    en: {
      selectCategory: "Please select a category",
      categoryRequired: "Category is required",
      listValidation: "Please add at least one point in each list field",
      created: "Job created successfully",
      createFailed: "Failed to create job",
      postNewJob: "Post a New Job",
      formDescription: "Fill in all required fields to match the backend job payload.",
      title: "Title",
      location: "Location",
      type: "Type",
      experience: "Experience",
      salary: "Salary",
      description: "Description",
      category: "Category",
      loadingCategories: "Loading categories...",
      selectCategoryOption: "Select a category",
      requiredSkills: "Required Skills",
      addRequiredSkill: "Add required skill",
      responsibilities: "Responsibilities",
      addResponsibility: "Add responsibility point",
      whoYouAre: "Who You Are",
      addWhoYouAre: "Add who-you-are point",
      niceToHaves: "Nice To Haves",
      addNiceToHave: "Add nice-to-have point",
      totalCapacity: "Total Capacity",
      applyBefore: "Apply Before",
      cancel: "Cancel",
      postJob: "Post Job",
      add: "Add",
    },
    fr: {
      selectCategory: "Veuillez selectionner une categorie",
      categoryRequired: "La categorie est obligatoire",
      listValidation: "Veuillez ajouter au moins un element dans chaque liste",
      created: "Offre creee avec succes",
      createFailed: "Echec de creation de l'offre",
      postNewJob: "Publier une nouvelle offre",
      formDescription: "Renseignez tous les champs requis pour correspondre au format attendu.",
      title: "Titre",
      location: "Localisation",
      type: "Type",
      experience: "Experience",
      salary: "Salaire",
      description: "Description",
      category: "Categorie",
      loadingCategories: "Chargement des categories...",
      selectCategoryOption: "Selectionner une categorie",
      requiredSkills: "Competences requises",
      addRequiredSkill: "Ajouter une competence",
      responsibilities: "Responsabilites",
      addResponsibility: "Ajouter une responsabilite",
      whoYouAre: "Votre profil",
      addWhoYouAre: "Ajouter un point profil",
      niceToHaves: "Atouts",
      addNiceToHave: "Ajouter un atout",
      totalCapacity: "Capacite totale",
      applyBefore: "Postuler avant",
      cancel: "Annuler",
      postJob: "Publier",
      add: "Ajouter",
    },
    ar: {
      selectCategory: "يرجى اختيار فئة",
      categoryRequired: "الفئة مطلوبة",
      listValidation: "يرجى اضافة عنصر واحد على الاقل في كل قائمة",
      created: "تم انشاء الوظيفة بنجاح",
      createFailed: "فشل انشاء الوظيفة",
      postNewJob: "نشر وظيفة جديدة",
      formDescription: "املأ جميع الحقول المطلوبة لتطابق بيانات الخادم.",
      title: "العنوان",
      location: "الموقع",
      type: "النوع",
      experience: "الخبرة",
      salary: "الراتب",
      description: "الوصف",
      category: "الفئة",
      loadingCategories: "جار تحميل الفئات...",
      selectCategoryOption: "اختر فئة",
      requiredSkills: "المهارات المطلوبة",
      addRequiredSkill: "اضف مهارة مطلوبة",
      responsibilities: "المسؤوليات",
      addResponsibility: "اضف مسؤولية",
      whoYouAre: "من انت",
      addWhoYouAre: "اضف نقطة عنك",
      niceToHaves: "مزايا اضافية",
      addNiceToHave: "اضف ميزة اضافية",
      totalCapacity: "السعة الكلية",
      applyBefore: "اخر موعد للتقديم",
      cancel: "الغاء",
      postJob: "نشر الوظيفة",
      add: "اضافة",
    },
  };

  const copy = createJobCopy[language] ?? createJobCopy.en;

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
    setCompany("019d0373-9de1-78b4-b177-2274fe9377ff");
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
      toast.error(copy.selectCategory);
      return;
    }



    const payload: CreateJobPayload = {
      title,
      company: "019d0373-9de1-78b4-b177-2274fe9377ff",
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
      toast.success(copy.created);
      onOpenChange(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || copy.createFailed);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
          {copy.postNewJob}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-175">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{copy.postNewJob}</DialogTitle>
            <DialogDescription className="mb-3">
              {copy.formDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="job-title">{copy.title}</Label>
              <Input
                id="job-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-location">{copy.location}</Label>
              <Input
                id="job-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-type">{copy.type}</Label>
              <Input
                id="job-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="full-time"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-experience">{copy.experience}</Label>
              <Input
                id="job-experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-salary">{copy.salary}</Label>
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
              <Label htmlFor="job-description">{copy.description}</Label>
              <Textarea
                id="job-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-categories">{copy.category}</Label>
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
                    ? copy.loadingCategories
                    : copy.selectCategoryOption}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categories || category.content || category.id}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-500">{copy.categoryRequired}</p>
            </div>

            <PointListInput
              label={copy.requiredSkills}
              addLabel={copy.add}
              inputId="job-required-skills"
              inputValue={requiredSkillInput}
              onInputChange={setRequiredSkillInput}
              placeholder={copy.addRequiredSkill}
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
              label={copy.responsibilities}
              addLabel={copy.add}
              inputId="job-responsibilities"
              inputValue={responsibilityInput}
              onInputChange={setResponsibilityInput}
              placeholder={copy.addResponsibility}
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
              label={copy.whoYouAre}
              addLabel={copy.add}
              inputId="job-who-you-are"
              inputValue={whoYouAreInput}
              onInputChange={setWhoYouAreInput}
              placeholder={copy.addWhoYouAre}
              items={whoYouAre}
              onAdd={() =>
                addItem(whoYouAreInput, setWhoYouAreInput, whoYouAre, setWhoYouAre)
              }
              onRemove={(index) => removeItem(index, whoYouAre, setWhoYouAre)}
            />

            <PointListInput
              label={copy.niceToHaves}
              addLabel={copy.add}
              inputId="job-nice-to-haves"
              inputValue={niceToHavesInput}
              onInputChange={setNiceToHavesInput}
              placeholder={copy.addNiceToHave}
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
              <Label htmlFor="job-total-capacity">{copy.totalCapacity}</Label>
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
              <Label htmlFor="job-apply-before">{copy.applyBefore}</Label>
              <Input
                id="job-apply-before"
                type="date"
                value={applyBefore}
                onChange={(e) => setApplyBefore(e.target.value)}
                required
              />
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="job-posted-on">Job Posted On</Label>
              <Input
                id="job-posted-on"
                type="date"
                value={jobPostedOn}
                onChange={(e) => setJobPostedOn(e.target.value)}
                required
              />
            </div> */}
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline" size="lg">
                {copy.cancel}
              </Button>
            </DialogClose>
            {isCreating ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" variant="primary" size="lg">
                {copy.postJob}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
