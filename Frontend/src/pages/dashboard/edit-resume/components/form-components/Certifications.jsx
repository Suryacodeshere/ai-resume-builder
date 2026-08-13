import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  title: "",
  date: "",
};

function Certifications({ resumeInfo, enanbledNext }) {
  const [certificationsList, setCertificationsList] = React.useState(
    resumeInfo?.certifications || []
  );
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, certifications: certificationsList }));
  }, [certificationsList]);

  const AddNewCertification = () => {
    setCertificationsList([...certificationsList, { ...formFields }]);
  };

  const RemoveCertification = (index) => {
    const list = [...certificationsList];
    const newList = list.filter((item, i) => i !== index);
    setCertificationsList(newList);
  };

  const handleChange = (e, index) => {
    if (enanbledNext) enanbledNext(false);
    const { name, value } = e.target;
    const list = [...certificationsList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setCertificationsList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        certifications: certificationsList,
      },
    };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Resume Updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          if (enanbledNext) enanbledNext(true);
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Certifications</h2>
      <p>Add your professional certifications and credentials</p>
      
      <div>
        {certificationsList.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-3 my-3 rounded-lg relative">
            <div>
              <label className="text-xs">Certification Name & Authority</label>
              <Input
                name="title"
                value={item.title}
                placeholder="e.g. Programming in Java - NPTEL (Elite + Gold, 97%)"
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Date</label>
              <div className="flex gap-2 items-center">
                <Input
                  name="date"
                  value={item.date}
                  placeholder="e.g. Apr 2026"
                  onChange={(e) => handleChange(e, index)}
                />
                <Button
                  variant="outline"
                  type="button"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => RemoveCertification(index)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between py-2">
        <Button onClick={AddNewCertification} variant="outline" className="text-primary">
          + Add Certification
        </Button>
        <Button onClick={onSave} disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Certifications;
