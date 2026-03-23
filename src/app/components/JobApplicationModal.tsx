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
        toast.error("Please upload a PDF or Word document");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
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
      toast.error("Please enter your name");
      return;
    }

    if (!formData.applicantEmail.trim() || !formData.applicantEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!formData.applicantPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!formData.coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }

    try {
      // Create FormData object to handle file and form fields
      const form = new FormData();
      form.append("applicantName", formData.applicantName);
      form.append("applicantEmail", formData.applicantEmail);
      form.append("applicantPhone", formData.applicantPhone);
      form.append("coverLetter", formData.coverLetter);
      form.append("id", jobId);
      // Append file if it exists
      if (formData.resume) {
        form.append("resume", formData.resume);
      }

      console.log("Application submitted with FormData");

      await createApplication(form).unwrap();
      
      toast.success("Application submitted successfully!");
      
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
      toast.error("Failed to submit application. Please try again.");
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
          <DialogTitle className="text-2xl font-bold">Apply for Position</DialogTitle>
          <DialogDescription className="text-base">
            <span className="font-semibold text-foreground">{jobTitle}</span>
            <br />
            <span className="text-muted-foreground">{company}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="applicantName" className="text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
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
              Email Address <span className="text-destructive">*</span>
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
              Phone Number <span className="text-destructive">*</span>
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
              Resume/CV <span className="text-muted-foreground">(Optional)</span>
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
              Accepted formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="text-sm font-medium">
              Cover Letter <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              placeholder="Tell us why you're a great fit for this position..."
              value={formData.coverLetter}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={6}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.coverLetter.length} characters
            </p>
          </div>

          <DialogFooter className="gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
