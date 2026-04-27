import { redirect } from "next/navigation";

export default function StandardWizardIndex() {
  redirect("/characters/new/standard/identity");
}
