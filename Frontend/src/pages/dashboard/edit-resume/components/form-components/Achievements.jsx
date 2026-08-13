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
  description: "",
};

function Achievements({ resumeInfo, enanbledNext }) {
  const [achievementsList, setAchievementsList] = React.useState(
    resumeInfo?.achievements || []
  );
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, achievements: achievementsList }));
  }, [achievementsList]);

  const AddNewAchievement = () => {
    setAchievementsList([...achievementsList, { ...formFields }]);
  };

  const RemoveAchievement = (index) => {
    const list = [...achievementsList];
    const newList = list.filter((item, i) => i !== index);
    setAchievementsList(newList);
  };

  const handleChange = (e, index) => {
    if (enanbledNext) enanbledNext(false);
    const { name, value } = e.target;
    const list = [...achievementsList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setAchievementsList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        achievements: achievementsList,
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
      <h2 className="font-bold text-lg">Achievements</h2>
      <p>Add key highlights, awards, and milestones you have achieved</p>
      
      <div>
        {achievementsList.map((item, index) => (
          <div key={index} className="flex gap-2 items-center my-3">
            <div className="flex-1">
              <label className="text-xs">Achievement Highlight</label>
              <Input
                name="description"
                value={item.description}
                placeholder="e.g. Selected for Round 2 of Smart India Hackathon (SIH), a national-level hackathon."
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div className="pt-5">
              <Button
                variant="outline"
                type="button"
                className="text-red-500 hover:bg-red-50"
                onClick={() => RemoveAchievement(index)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between py-2">
        <Button onClick={AddNewAchievement} variant="outline" className="text-primary">
          + Add Achievement
        </Button>
        <Button onClick={onSave} disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Achievements;
