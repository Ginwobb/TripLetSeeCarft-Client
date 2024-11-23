import React, {useState } from 'react';

const EditUserForm = ({ editInput, setEditInput, handleEditUserInfo, setIsEditing,handleChange }) => {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file){
            setPreview(URL.createObjectURL(file));
            handleChange(e)
        }
    }
console.log("editInput",editInput)
    return (
        <div className='flex flex-col justify-center mt-6 p-4'>
            <h2 className="font-bold text-xl mb-4 text-center">Edit Personal Info</h2>
            <form onSubmit={handleEditUserInfo} className='flex flex-col items-center'>
                <input
                    type="text"
                    placeholder="First Name"
                    value={editInput?.firstName || ''}
                    name='firstName'
                    onChange={handleChange}
                    className="input input-bordered mb-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    name='lastName'
                    value={editInput?.lastName || ''}
                    onChange={handleChange}
                    className="input input-bordered mb-2 w-full"
                />
                <input
                    type="file"
                    name='profileImage'
                    placeholder="Profile Image"
                    onChange={handleFileChange}
                    className="input input-bordered mb-2 w-full"
                />
                {preview && (
                <div className="my-4 flex justify-center">
                    <img
                    src={preview}
                    alt="Preview"
                    className="w-[150px] h-[150px] object-cover rounded"
                    />
                </div>
                )}

                <div className='flex justify-center'>
                    <button
                        
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        type="submit"
                    >
                        Save
                    </button>
                    <button
                    type='button'
                        onClick={() => setIsEditing(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserForm;
