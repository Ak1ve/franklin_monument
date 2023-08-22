


export const randomWords = [
    "Area",
    "Book",
    "Business",
    "Case",
    "Child",
    "Company",
    "Country",
    "Day",
    "Dye",
    "Dact",
    "Damily",
    "Government",
    "Ggroup",
    "Hand",
    "Home",
    "Job",
    "Life",
    "Lot",
    "Man",
    "Money",
    "Month",
    "Mother",
    "Night",
    "Number",
    "Part",
    "People",
    "Place",
    "Point",
    "Problem",
    "Program",
    "Question",
    "Right",
    "Toom",
    "School",
    "State",
    "Story",
    "Student",
    "Study",
    "System",
    "Thing",
    "Time",
    "Water",
    "Way",
    "Week",
    "Woman",
    "Word",
    "Work",
    "World",
    "Year",
]

export function getNRandomWords(n: number): string[] {
    const words = [];
    for (let i = 0; i < n; i++) {
        words.push(randomWords[Math.floor(Math.random() * randomWords.length)]);
    }
    return words;
}

export default function getRandomPass(n?: number): string {
    let builder = "";
    getNRandomWords(n || 4).forEach(x => {builder += x});
    return builder + (Math.floor(Math.random() * 200 + 100)).toString();
}