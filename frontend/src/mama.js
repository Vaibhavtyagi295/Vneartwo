import React, { useState } from 'react';

const SubcategorySelection = () => {
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const subcategories = [
    { id: 1, name: 'Subcategory 1' },
    { id: 2, name: 'Subcategory 2' },
    { id: 3, name: 'Subcategory 3' },
    { id: 4, name: 'Subcategory 4' },
    { id: 5, name: 'Subcategory 5' },
  ];

  const handleSubcategorySelect = (subcategory) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter((s) => s !== subcategory));
    } else {
      if (selectedSubcategories.length < 3) {
        setSelectedSubcategories([...selectedSubcategories, subcategory]);
      }
    }
  };

  const isSubcategorySelected = (subcategory) => selectedSubcategories.includes(subcategory);

  return (
    <div>
      <h1>Select Subcategories (Choose 3)</h1>
      <ul>
        {subcategories.map((subcategory) => (
          <li
            key={subcategory.id}
            onClick={() => handleSubcategorySelect(subcategory)}
            style={{ fontWeight: isSubcategorySelected(subcategory) ? 'bold' : 'normal' }}
          >
            {subcategory.name}
          </li>
        ))}
      </ul>
      <p>Selected Subcategories: {selectedSubcategories.map((s) => s.name).join(', ')}</p>
    </div>
  );
};

export default SubcategorySelection;
