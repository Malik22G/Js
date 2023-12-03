import { createModalContext } from "@/components/ui/Modal/ModalContext";
import { PlacePost } from "@/lib/api/places";

export const OnboardingModalContext = createModalContext<Partial<PlacePost>>();
