"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateApplicationMutation } from "@/Redux/Services/JobApi";
import { type Language, useI18n } from "@/context/I18nContext";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  company: string;
}

export function JobApplicationModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  company,
}: JobApplicationModalProps) {
  const { language } = useI18n();
  const applicationCopy: Record<Language, Record<string, string>> = {
    en: {
      fileTypeError: "Please upload a PDF or Word document",
      fileSizeError: "File size must be less than 5MB",
      nameRequired: "Please enter your name",
      emailInvalid: "Please enter a valid email",
      phoneRequired: "Please enter your phone number",
      coverLetterRequired: "Please write a cover letter",
      submitted: "Application submitted successfully!",
      submitFailed: "Failed to submit application. Please try again.",
      title: "Apply for Position",
      fullName: "Full Name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      resume: "Resume/CV",
      optional: "Optional",
      acceptedFormats: "Accepted formats: PDF, DOC, DOCX (Max 5MB)",
      coverLetter: "Cover Letter",
      coverLetterPlaceholder: "Tell us why you're a great fit for this position...",
      characters: "characters",
      cancel: "Cancel",
      submitting: "Submitting...",
      submitApplication: "Submit Application",
    },
    fr: {
      fileTypeError: "Veuillez televerser un document PDF ou Word",
      fileSizeError: "La taille du fichier doit etre inferieure a 5MB",
      nameRequired: "Veuillez entrer votre nom",
      emailInvalid: "Veuillez entrer un email valide",
      phoneRequired: "Veuillez entrer votre numero de telephone",
      coverLetterRequired: "Veuillez rediger une lettre de motivation",
      submitted: "Candidature envoyee avec succes",
      submitFailed: "Echec de l'envoi. Veuillez reessayer.",
      title: "Postuler au poste",
      fullName: "Nom complet",
      emailAddress: "Adresse email",
      phoneNumber: "Numero de telephone",
      resume: "CV",
      optional: "Optionnel",
      acceptedFormats: "Formats acceptes: PDF, DOC, DOCX (Max 5MB)",
      coverLetter: "Lettre de motivation",
      coverLetterPlaceholder: "Expliquez pourquoi vous etes un bon candidat pour ce poste...",
      characters: "caracteres",
      cancel: "Annuler",
      submitting: "Envoi...",
      submitApplication: "Envoyer la candidature",
    },
    ar: {
      fileTypeError: "يرجى رفع ملف PDF او Word",
      fileSizeError: "يجب ان يكون حجم الملف اقل من 5 ميغابايت",
      nameRequired: "يرجى ادخال الاسم",
      emailInvalid: "يرجى ادخال بريد الكتروني صحيح",
      phoneRequired: "يرجى ادخال رقم الهاتف",
      coverLetterRequired: "يرجى كتابة رسالة تقديم",
      submitted: "تم ارسال طلب التوظيف بنجاح",
      submitFailed: "فشل ارسال الطلب. يرجى المحاولة مرة اخرى.",
      title: "التقديم على الوظيفة",
      fullName: "الاسم الكامل",
      emailAddress: "البريد الالكتروني",
      phoneNumber: "رقم الهاتف",
      resume: "السيرة الذاتية",
      optional: "اختياري",
      acceptedFormats: "الصيغ المقبولة: PDF, DOC, DOCX (الحد الاقصى 5MB)",
      coverLetter: "رسالة التقديم",
      coverLetterPlaceholder: "اخبرنا لماذا انت مناسب لهذا المنصب...",
      characters: "حرف",
      cancel: "الغاء",
      submitting: "جار الارسال...",
      submitApplication: "ارسال الطلب",
    },
  };
  const copy = applicationCopy[language] ?? applicationCopy.en;

  const [formData, setFormData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: "",
    resume: null as File | null,
  });


  // Uncomment when backend is ready
  const [createApplication, { isLoading: isSubmitting }] = useCreateApplicationMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(copy.fileTypeError);
        return;
      }

      if (file.size > maxSize) {
        toast.error(copy.fileSizeError);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      resume: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.applicantName.trim()) {
      toast.error(copy.nameRequired);
      return;
    }

    if (!formData.applicantEmail.trim() || !formData.applicantEmail.includes("@")) {
      toast.error(copy.emailInvalid);
      return;
    }

    if (!formData.applicantPhone.trim()) {
      toast.error(copy.phoneRequired);
      return;
    }

    if (!formData.coverLetter.trim()) {
      toast.error(copy.coverLetterRequired);
      return;
    }

    try {
      const form = new FormData();
      form.append("applicantName", formData.applicantName);
      form.append("applicantEmail", formData.applicantEmail);
      form.append("applicantPhone", formData.applicantPhone);
      form.append("coverLetter", formData.coverLetter);
      form.append("id", jobId);
      if (formData.resume) {
        form.append("resume", formData.resume);
      }

      console.log("Application submitted with FormData");

      await createApplication(form).unwrap();
      
      toast.success(copy.submitted);
      
      // Reset form
      setFormData({
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        coverLetter: "",
        resume: null,
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(copy.submitFailed);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{copy.title}</DialogTitle>
          <DialogDescription className="text-base">
            <span className="font-semibold text-foreground">{jobTitle}</span>
            <br />
            {/* <span className="text-muted-foreground">{company}</span> */}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="applicantName" className="text-sm font-medium">
              {copy.fullName} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="applicantName"
              name="applicantName"
              type="text"
              placeholder="John Doe"
              value={formData.applicantName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="applicantEmail" className="text-sm font-medium">
              {copy.emailAddress} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="applicantEmail"
              name="applicantEmail"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.applicantEmail}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="applicantPhone" className="text-sm font-medium">
              {copy.phoneNumber} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="applicantPhone"
              name="applicantPhone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.applicantPhone}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-sm font-medium">
              {copy.resume} <span className="text-muted-foreground">({copy.optional})</span>
            </Label>
            {!formData.resume ? (
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                />
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium">{formData.resume.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.resume.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {copy.acceptedFormats}
            </p>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="text-sm font-medium">
              {copy.coverLetter} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              placeholder={copy.coverLetterPlaceholder}
              value={formData.coverLetter}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={6}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.coverLetter.length} {copy.characters}
            </p>
          </div>

          <DialogFooter className="gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {copy.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {copy.submitting}
                </>
              ) : (
                copy.submitApplication
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
