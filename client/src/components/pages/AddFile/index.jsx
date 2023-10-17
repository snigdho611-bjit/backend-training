import { useState } from "react";

const AddFile = () => {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState({ message: "", success: false, loading: false })

  const handleSubmit = () => {
    setRes({ message: "", success: false, loading: true })

    const formData = new FormData();
    formData.append("file_to_upload", file[0]);

    fetch(`${import.meta.env.VITE_BACKEND}/files/upload-file`, {
      method: "POST",
      body: formData,
    }).then((response) => response.json()).then(json => {
      if (json.success) {
        setRes({ message: json.message, success: true, loading: false })
      } else {
        setRes({ message: "Failed to upload file", success: false, loading: false })

      }
    }).catch(err => {
      setRes({ message: "Failed to upload file", success: false, loading: false })
    });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files)}
      />
      <button
        onClick={() => {
          handleSubmit();
        }}
      >
        Upload
      </button>
      {res.message && res.message !== "" ? res.message : null}
    </div>
  );
};

export default AddFile;
