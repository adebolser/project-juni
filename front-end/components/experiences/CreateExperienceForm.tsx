import { useState } from "react";
import { Experience, StatusMessage } from "@types";
import ExperienceService from "@services/ExperienceService";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateExperienceForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  // state var to keep track of input field updates 
  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [date, setDate] = useState<Date|null>(null);  
  const [location, setLocation] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
 
  const [statusMessage, setStatusMessage] = useState<StatusMessage>();
 
  const clearErrors = () => {
    setStatusMessage(undefined);
    setNameError(null);
    setDescriptionError(null);
    setDateError(null);
    setLocationError(null);
  };

  const validate = (): boolean => {
    let result = true;

    if (!name || name.trim() === "") {
        setNameError("Name is required");
        result = false;
    } 
    
    if (!description || description.trim() === "") {
        setDescriptionError("Description is required");
        result = false;
    } 
    
    if (!date) {
        setDateError("Date is required");
        result = false;
    } 
    
    if (!location || location.trim() === "") {
        setLocationError("Location is required");
        result = false;
    }    
    return result;
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    // avoid the standard behavior of the browser (= reloading the whole page)
    event.preventDefault();

    //clear all previous error messages
    clearErrors();

    if (!validate()) {
      return;
    }

    const response = await ExperienceService.createExperience({
      name,
      description,
      date: date!.toISOString(),
      location
    }); 
    
    if (response.status === 201) {
      setStatusMessage({message:"Experience created successfully", type:"success"});
 
      // automatic redirecting the user to the experiences overview page after 2 sec
      // the 2sec is to allow informing the user that the time registration was succesfull
      setTimeout(() => {
          onSuccess()  
      }, 2000);
    }
    else {
      const { message, status }= await response.json();
      setStatusMessage({message:`Server error: ${message}`, type:"error"});
    }
  }
 

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Experience</h2>

      {statusMessage && (
        <div
          className={`mb-4 p-3 rounded ${
            statusMessage.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Experience Name *
          </label>
          <input 
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter experience name"
            value={name}
            onChange={(event) => {
                const newName = event.target.value;
                setName(newName);
               }}
          />
          {nameError && <div className="text-red-800 ">{nameError}</div>}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the experience"
            value={description}
            onChange={(event) => {
                const newDescription = event.target.value;
                setDescription(newDescription);
               }}
          />
          {descriptionError && <div className="text-red-800 ">{descriptionError}</div>}
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date *
          </label>
          <input
            type="datetime-local"
            id="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            onChange={(event) => {
                const newDate = new Date(event.target.value);
                setDate(newDate);
               }}
          />
          {dateError && <div className="text-red-800 ">{dateError}</div>}
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter location"
            value={location}
            onChange={(event) => {
                const newLocation = event.target.value;
                setLocation(newLocation);
               }}
          />
          {locationError && <div className="text-red-800 ">{locationError}</div>}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-4 py-2"
          >
            Create Experience
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExperienceForm;
