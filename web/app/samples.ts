export const hoyoverse = `talk = |name, to| {
    msg = if name == "Pardofelis" and to == "Mei" {
        "芽衣姐，我不想死……"
    } else if name == "Focalors" and to == "Neuvillette" {
        "再见纳维莱特，希望你喜欢这五百年来属于你的戏份。"
    } else if name == "Acheron" {
        "我为逝者哀哭！"
    } else if name == "Burnice" {
        "BURNICE x6 GO GO!"
    } else {
        "Hello, " + to
    }
    name + ": " + msg
};

people = [
    ("Pardofelis", "Mei"),
    ("Focalors", "Neuvillette"),
    ("Acheron", "Aventurine"),
    ("Burnice", "Caesar"),
    ("FelysNeko", rust __elysia__),
];

for (name, to) in people {
    print talk(name, to);
}
`;

export const elysia = `// The motivation of this entire project is to create a language where 
// Elysia exists, so regardless of how this project evolves in the future,
// there must exist a built-in identifier named \`__elysia__\`.

name = ("爱莉希雅", "Elysia");
nickname = rust __elysia__;
birthday = "Nov. 11th";

print (name, nickname, birthday)
`;

export const playground = `// Here's your playground
`;

export const author = `print rust __author__;`;
