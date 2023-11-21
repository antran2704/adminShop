const handleCheckFields = (data: any): string[] => {
  let fields = [];
  for (const item of data) {
    if (!item.value || item.value.length === 0) {
      fields.push(item.name);
    }
  }

  return fields;
};

const handleRemoveCheck = (fields: string[], name: string) => {
    const newFieldsCheck = fields.filter(
      (field: string) => field !== name
    );

    return newFieldsCheck;
  };

export { handleCheckFields, handleRemoveCheck };
