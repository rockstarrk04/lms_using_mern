/**
 * Determines the appropriate thumbnail URL for a given course.
 * It uses special-cased local images for certain course titles,
 * otherwise falls back to the course's own thumbnail property or a
 * dynamically generated Unsplash image URL.
 *
 * @param {object} course - The course object, which must have a `title` property.
 * @param {string} [size='400x225'] - The desired image size for Unsplash fallback (e.g., '500x281').
 * @returns {string} The resolved thumbnail URL.
 */
export const getThumbnailUrl = (course, size = '400x225') => {
  if (!course || !course.title) {
    // Return a default placeholder if course is invalid
    return `https://source.unsplash.com/${size}/?learning`;
  }

  const lowerCaseTitle = course.title.toLowerCase();
  const specialThumbnails = {
    "python": "/src/assets/img/python.webp",
    "web development bootcamp": "/src/assets/img/web.webp",
    "data science fundamentals": "/src/assets/img/data.webp",
    "sql & database management": "/src/assets/img/sql.webp",
    "ai & machine learning basics": "/src/assets/img/ai.webp",
  };

  const specialKey = Object.keys(specialThumbnails).find(key => lowerCaseTitle.includes(key));
  return specialThumbnails[specialKey] || course.thumbnail || `https://source.unsplash.com/${size}/?${encodeURIComponent(course.title)}`;
};