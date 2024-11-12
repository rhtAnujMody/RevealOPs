import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Pencil1Icon, PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import { ReloadIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeDetails {
  id: number;
  bandwidth_available: number;
  employee_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  employee_type: string;
  business_unit: string;
  location: string;
  joining_date: string;
  designation: string;
  team: string;
  status: string;
  job_level: string;
  active_status: string;
  reporting_to: number;
  projects: number[];
}

interface SkillMatrix {
  employee_skill_id: number;
  employee_id: string;
  employee_name: string;
  primary_skills: Skill[];
  secondary_skills: Skill[];
  other_skills: Skill[];
  cloud_skills: Skill[];
  certifications: string[];
}

interface Skill {
  skill_id: number;
  skill: string;
  competency: string;
  category: string;
}

interface TimelineItem {
  id: number;
  project_name: string;
  project_id: number;
  role: string;
  allocation_start_date: string;
  allocation_end_date: string;
  bandwidth_allocated: number;
  billable: string;
}

interface AddSkillFormData {
  skill: string;
  competency: string;
  category: string;
}

export default function EmployeeDetails() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState<EmployeeDetails | null>(null);
  const [skillMatrix, setSkillMatrix] = useState<SkillMatrix | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState<AddSkillFormData>({
    skill: "",
    competency: "",
    category: "primary_skills",
  });
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get employee details using the numeric id
        const employeeResponse = await apiRequest<EmployeeDetails>(
          `${constants.ALL_EMPLOYEES}${employeeData?.id || employeeId}/`,
          "GET"
        );

        // If we have the employee data, use it for subsequent calls
        if (employeeResponse.ok && employeeResponse.data) {
          setEmployeeData(employeeResponse.data);
          
          // Fetch skill matrix using the numeric id
          const skillsResponse = await apiRequest<SkillMatrix>(
            `${constants.EMPLOYEE_SKILLS}${employeeResponse.data.id}/`,
            "GET"
          );

          // Fetch timeline using the numeric id
          const timelineResponse = await apiRequest<TimelineItem[]>(
            constants.EMPLOYEE_TIMELINE.replace(
              "{employee_id}",
              employeeResponse.data.id.toString()
            ),
            "GET"
          );

          if (skillsResponse.ok) {
            setSkillMatrix(skillsResponse.data || null);
          }
          
          if (timelineResponse.ok) {
            setTimeline(timelineResponse.data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Failed to fetch employee data");
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchData();
    }
  }, [employeeId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/employees/${employeeId}/edit`);
  };

  const DisplayEmployeeDetails = ({
    header,
    data,
    titleId,
    valueId,
  }: {
    header: string;
    data: string | number | undefined;
    titleId?: string;
    valueId?: string;
  }) => {
    return (
      <div className="p-2">
        <span className="text-sm font-medium text-gray-500" id={titleId}>
          {header}
        </span>
        <p className="text-base font-semibold text-gray-900 mt-1" id={valueId}>
          {data || "N/A"}
        </p>
      </div>
    );
  };

  const getStatusTag = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < now) {
      return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">Completed</span>;
    } else if (start <= now && end >= now) {
      return <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Active</span>;
    } else {
      return <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">Upcoming</span>;
    }
  };

  const handleAddSkill = async () => {
    try {
      const response = await apiRequest(
        `${constants.EMPLOYEE_SKILLS}${employeeData?.id}/add_skill/`,
        "POST",
        newSkill
      );

      if (response.ok) {
        toast.success("Skill added successfully");
        // Refresh skill matrix
        const skillsResponse = await apiRequest<SkillMatrix>(
          `${constants.EMPLOYEE_SKILLS}${employeeData?.id}/`,
          "GET"
        );
        if (skillsResponse.ok) {
          setSkillMatrix(skillsResponse.data || null);
        }
        setIsAddingSkill(false);
      } else {
        toast.error("Failed to add skill");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  const handleRemoveSkill = async (skillId: number, category: string) => {
    try {
      const response = await apiRequest(
        `${constants.EMPLOYEE_SKILLS}${employeeData?.id}/remove_skill/`,
        "POST",
        { skill_id: skillId, category }
      );

      if (response.ok) {
        toast.success("Skill removed successfully");
        // Refresh skill matrix
        const skillsResponse = await apiRequest<SkillMatrix>(
          `${constants.EMPLOYEE_SKILLS}${employeeData?.id}/`,
          "GET"
        );
        if (skillsResponse.ok) {
          setSkillMatrix(skillsResponse.data || null);
        }
      } else {
        toast.error("Failed to remove skill");
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      toast.error("Failed to remove skill");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <ReloadIcon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10 w-full">
        <div className="flex items-center">
          <Button
            onClick={handleBackClick}
            variant="outline"
            size="sm"
            className="mr-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Employee Details</h1>
        </div>
        <Button
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="flex items-center hidden"
        >
          <Pencil1Icon className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto px-6 py-4 space-y-4 w-full">
        {/* Basic Details Section */}
        <div className="bg-white shadow-sm rounded-lg w-full">
          <h2 className="text-xl font-bold px-6 py-4 border-b w-full">
            {employeeData?.first_name} {employeeData?.last_name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full">
            <DisplayEmployeeDetails
              header="Employee ID"
              data={employeeData?.employee_id}
            />
            <DisplayEmployeeDetails
              header="Business Unit"
              data={employeeData?.business_unit}
            />
            <DisplayEmployeeDetails
              header="Designation"
              data={employeeData?.designation}
            />
            <DisplayEmployeeDetails
              header="Team"
              data={employeeData?.team}
            />
            <DisplayEmployeeDetails
              header="Status"
              data={employeeData?.active_status}
            />
            <DisplayEmployeeDetails
              header="Job Level"
              data={employeeData?.job_level}
            />
            <DisplayEmployeeDetails
              header="Location"
              data={employeeData?.location}
            />
            <DisplayEmployeeDetails
              header="Joining Date"
              data={employeeData?.joining_date}
            />
            <DisplayEmployeeDetails
              header="Bandwidth Available"
              data={`${employeeData?.bandwidth_available}%`}
            />
          </div>
        </div>

        {/* Skill Matrix Section */}
        <div className="bg-white shadow-sm rounded-lg w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-xl font-bold">Skill Matrix</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => setIsEditingSkills(!isEditingSkills)}
              >
                <Pencil1Icon className="w-4 h-4 mr-1" />
                {isEditingSkills ? 'Done' : 'Edit Skills'}
              </Button>
              {isEditingSkills && (
                <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Skill</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select
                          value={newSkill.category}
                          onValueChange={(value: string) =>
                            setNewSkill({ ...newSkill, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary_skills">Primary Skills</SelectItem>
                            <SelectItem value="secondary_skills">Secondary Skills</SelectItem>
                            <SelectItem value="other_skills">Other Skills</SelectItem>
                            <SelectItem value="cloud_skills">Cloud Skills</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Skill</label>
                        <input
                          type="text"
                          className="w-full border rounded-md p-2 mt-1"
                          value={newSkill.skill}
                          onChange={(e) =>
                            setNewSkill({ ...newSkill, skill: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Competency</label>
                        <Select
                          value={newSkill.competency}
                          onValueChange={(value: string) =>
                            setNewSkill({ ...newSkill, competency: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select competency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddSkill} className="w-full">
                        Add Skill
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          <div className="p-4 space-y-4 w-full">
            {skillMatrix && skillMatrix.primary_skills && skillMatrix.primary_skills.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2">Primary Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skillMatrix.primary_skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill.skill} - {skill.competency}
                      {isEditingSkills && (
                        <button
                          onClick={() => handleRemoveSkill(skill.skill_id, "primary_skills")}
                          className="hover:text-blue-900"
                        >
                          <Cross2Icon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillMatrix && skillMatrix.secondary_skills && skillMatrix.secondary_skills.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2">Secondary Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skillMatrix.secondary_skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill.skill} - {skill.competency}
                      {isEditingSkills && (
                        <button
                          onClick={() => handleRemoveSkill(skill.skill_id, "secondary_skills")}
                          className="hover:text-green-900"
                        >
                          <Cross2Icon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillMatrix && skillMatrix.other_skills && skillMatrix.other_skills.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2">Other Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skillMatrix.other_skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill.skill} - {skill.competency}
                      {isEditingSkills && (
                        <button
                          onClick={() => handleRemoveSkill(skill.skill_id, "other_skills")}
                          className="hover:text-gray-900"
                        >
                          <Cross2Icon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillMatrix && skillMatrix.cloud_skills && skillMatrix.cloud_skills.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2">Cloud Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skillMatrix.cloud_skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill.skill} - {skill.competency}
                      {isEditingSkills && (
                        <button
                          onClick={() => handleRemoveSkill(skill.skill_id, "cloud_skills")}
                          className="hover:text-orange-900"
                        >
                          <Cross2Icon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillMatrix && skillMatrix.certifications && skillMatrix.certifications.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {skillMatrix.certifications.map((cert, index) => (
                    <div key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white shadow-sm rounded-lg w-full">
          <h2 className="text-xl font-bold px-6 py-4 border-b">Project Timeline</h2>
          <div className="p-4 space-y-3 w-full">
            {timeline.length > 0 ? (
              timeline.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => navigate(`/projects/${item.project_id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {item.project_name}
                      </h3>
                      <p className="text-sm text-gray-600">{item.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusTag(item.allocation_start_date, item.allocation_end_date)}
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {item.bandwidth_allocated}% Allocated
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(item.allocation_start_date), 'MMM d, yyyy')} - {format(new Date(item.allocation_end_date), 'MMM d, yyyy')}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No timeline data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 