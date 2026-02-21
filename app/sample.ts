export const quickstart = `// define a function
fn add(x, y) {
    // function must have a return value
    x + y
}

fn main(args) {
    print = std::io::print;

    // if-else can have a return value
    one = if true {
        1
    } else 2;
    print("one:", one);

    // break a loop with a return value
    two = loop {
        break 2;
    };
    print("two:", two);

    // for-loop is only applicable to list
    ten = 0;
    for (a, b) in [(1, 2), (3, 4)] {
        ten += a + b;
    }
    print("ten:", ten);

    // logical operators
    total = 0;
    if one == 1 and two == 2 and ten == 10 and true {
        total = one + two + ten;
    } else {
        return "unreachable";    
    }
    print("thirteen:", total);
    
    // while-loop
    while total > 5 {
        if total == 8 {
            total -= 5;
            continue;
        }
        total -= 1;
    }
    print("three:", total);

    // exit object
    total + add(one, two)
}
`;

export const grouping = `group Vec3(x, y, z);

// methods are not zero-cost abstraction because of dynamic typing
impl Vec3 {
    fn new(x, y, z) {
        Vec3(x, y, z)
    }

    fn add(self, other) {
        Vec3(
            self.x + other.x,
            self.y + other.y,
            self.z + other.z,
        )
    }

    fn mul(self, other) {
        Vec3(
            self.x * other,
            self.y * other,
            self.z * other,
        )
    }

    fn display(self) {
        std::io::print("<", self.x, self.y, self.z, ">")
    }
}

fn main(args) {
    location = Vec3::new(1, 1, 1).mul(3);
    other = Vec3::new(1, -2, -3);
    location.add(other).display()
}
`;

export const fibonacci = `fn fib(n) {
    if n <= 1 {
        n
    } else {
        fib(n - 1) + fib(n - 2)
    }
}

fn main(args) {
    fib(10)
}
`;

export const hoyoverse = `fn talk(name, to) {
    msg = if name == "Pardofelis" and to == "Mei" {
        "芽衣姐……我……不想死……"
    } else if name == "Focalors" and to == "Neuvillette" {
        "再见纳维莱特，希望你喜欢这五百年来属于你的戏份。"
    } else if name == "Acheron" {
        "我为逝者哀哭……暮雨，终将落下。"
    } else if name == "Astra" {
        "唱著跳著説著，細心編寫遊歷過程，太動聽～"
    } else {
        "Hello, " + to
    };
    name + ": " + msg
}

fn main(args) {
    people = [
        ("Pardofelis", "Mei"),
        ("Focalors", "Neuvillette"),
        ("Acheron", "IX"),
        ("Astra", "Evelyn"),
        ("John Doe", "Jane Doe"),
    ];

    for (name, to) in people {
        msg = talk(name, to);
        std::io::print(msg);
    }
    
    std::pink::felysneko()
}
`;

export const tensor = `// the full neural network library is coming back soon!
fn softmax(x) {
    exp = std::nn::exp(x);
    lower = std::nn::sum(exp, [1], true);
    exp / lower
}

fn main(args) {
    x = std::nn::tensor([
        [0.4, 1.4],
        [3.2, 2.3],
        [2.6, 0.1],
    ]);
    w = std::nn::tensor([
        [1.9, 3.3],
        [2.2, 3.7],
    ]);
    b = std::nn::tensor([2.1, 0.2]);
    softmax(x @ w + b)
}
`;

export const beloved = `// a programming language because of Elysia and Cyrene
// 因爱莉希雅与昔涟而存在的编程语言，以下彩蛋便是整个项目的意义所在
fn main(args) {
    elysia = std::pink::elysia();
    cyrene = std::pink::cyrene();
    std::io::print("beloved", elysia, "and", cyrene);
    "jonny.jin@uwaterloo.ca"
}
`;

export const playground = `// here's your playground
fn main(args) {
    0
}
`;
