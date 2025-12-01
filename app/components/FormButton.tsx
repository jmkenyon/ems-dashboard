import { Button } from "@/components/ui/button";

interface FormButtonProps {
  children: React.ReactNode;
}

const FormButton = ({ children }: FormButtonProps) => {
  return (
    <Button
      type="submit"
      variant="elevated"
      className="rounded-full border-transparent px-3.5 text-lg mt-10 bg-blue-950 text-white hover:bg-white hover:text-blue-950  hover:border-blue-950"
    >
      {children}
    </Button>
  );
};

export default FormButton;
