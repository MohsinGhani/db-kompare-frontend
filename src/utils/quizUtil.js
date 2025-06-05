// const X_API_KEY = "d41d8cd98f00b204e9800998ecf8427e";
// const API_BASE_URL = "http://localhost:4000/dev" ;
const X_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_1;

// Generic fetch helper
const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `Network response was not ok: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

// Create a new quiz
export const createQuiz = async (quizData) => {
  const url = `${API_BASE_URL}/create-quiz`;
  return fetchAPI(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(quizData),
  });
};

// Create a new quiz question
export const createQuizQuesions = async (quizData) => {
  const url = `${API_BASE_URL}/create-quiz-questions`;
  return fetchAPI(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(quizData),
  });
};
// Create a new quiz submission
export const createQuizSubmission = async (quizData) => {
  const url = `${API_BASE_URL}/create-quiz-submission`;
  return fetchAPI(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(quizData),
  });
};

// Fetch all quizzes (optionally filtered by status)
export const fetchQuizzes = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${API_BASE_URL}/get-quizzes${
    queryString ? `?${queryString}` : ""
  }`;
  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};
// Fetch all quizzes questions (optionally filtered by status)
export const fetchQuizzesQuestions = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${API_BASE_URL}/get-quiz-questions${
    queryString ? `?${queryString}` : ""
  }`;
  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};

// Fetch a single quiz by ID
export const fetchQuizById = async (id) => {
  const url = `${API_BASE_URL}/quiz/${id}`;
  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};
// Fetch a single quiz by ID
export const fetchQuizSubmissionById = async (id) => {
  const url = `${API_BASE_URL}/quiz-submission/${id}`;
  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};

// Update an existing quiz by ID
export const updateQuiz = async (id, updateData) => {
  const url = `${API_BASE_URL}/quiz/${id}`;
  return fetchAPI(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(updateData),
  });
};
// Update an existing quiz by ID
export const updateQuizQuestion = async (id, updateData) => {
  const url = `${API_BASE_URL}/quiz-question/${id}`;
  return fetchAPI(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(updateData),
  });
};

// Delete a quiz by ID
export const deleteQuiz = async (id) => {
  const url = `${API_BASE_URL}/quiz/${id}`;
  return fetchAPI(url, {
    method: "DELETE",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};
// Delete a quiz by ID
export const deleteQuizQuestion = async (id) => {
  const url = `${API_BASE_URL}/quiz-question/${id}`;
  return fetchAPI(url, {
    method: "DELETE",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};



// Fetch a single certificate by ID
export const fetchCertificateById = async (id) => {
  const url = `${API_BASE_URL}/certificate/${id}`;
  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};

// Fetch all certificates (optionally filtered by query parameters)
export const fetchCertificates = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${API_BASE_URL}/get-certificates${
    queryString ? `?${queryString}` : ""
  }`;
  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};