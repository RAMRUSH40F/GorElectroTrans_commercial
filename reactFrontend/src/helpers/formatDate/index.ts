export const formatDate = (date: string): string => {
    const formattedDate = date.split("-").reverse().join(".");
    return formattedDate;
};
