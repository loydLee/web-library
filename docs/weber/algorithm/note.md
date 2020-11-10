# 算法与数据结构

## 数组的交集

给定数组，求交集

```js
es5:
let b = a.filter(function(v) {
  return b.indexOf(v) > -1
})

es6

let b = a.filter(x => b.has(x))
```

拓展：并、补、差

```js
并;
let c = Array.from(new Set([...a, ...b]));
补;
let c = [...a.filter((x) => !b.has(x)), ...b.filter((x) => !a.has(x))];
差;
let c = a.filter((x) => !b.has(x));
```

## 根据数字二进制下的 1 数目排序

思路：将所有数字的二进制 1 数目存储起来，如果二进制下 1 数目相同则比较数字本身，排序使用 sort

```js
let sortByBites = function(arr) {
  const m = new Map(); //使用map对每个数字的二进制1数目进行存储 object也可以
  arr.forEach((item) => {
    let temp = item;
    let count = 0;
    while (temp) {
      temp = temp & (temp - 1);
      count++;
    }

    m.set(item, count);
  });

  return arr.sort((a, b) => {
    if (m.get(a) === m.get(b)) {
      return a - b;
    } else {
      return m.get(a) - m.get(b);
    }
  });
};
```

## 下一个排列

实现获取下一个排列的函数，算法需要将给定数字序列重新排列成字典序中下一个更大的排列。

如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。

必须原地修改，只允许使用额外常数空间。

以下是一些例子，输入位于左侧列，其相应输出位于右侧列。
1,2,3 → 1,3,2
3,2,1 → 1,2,3
1,1,5 → 1,5,1

思路：从右向左遍历，找到第一个小于右邻居的数，如果该数存在，将他和邻居进行交换实现变大，如果不存在，说明数本来就是按照递减排列，将数组翻转即可

```js
var nextPermutation = function(nums) {
  let i = nums.length - 2; // 从倒数第二个，向左遍历 1
  while (i >= 0 && nums[i] >= nums[i + 1]) {
    // 寻找第一个小于右邻居的数
    i--;
  }
  if (i >= 0) {
    // 这个数在数组中存在
    let j = nums.length - 1; // 从最后一项，向左遍历
    while (j >= 0 && nums[j] <= nums[i]) {
      // 寻找第一个小于 nums[i] 的数
      j--;
    }
    [nums[i], nums[j]] = [nums[j], nums[i]]; // 两数交换，实现变大
  }
  // 如果i=-1，说明是递减排列，如 321，则直接翻转为最小排列：123
  let l = i + 1; // i 右边的数进行翻转，使得变大的幅度小一些
  let r = nums.length - 1;
  while (l < r) {
    [nums[l], nums[r]] = [nums[r], nums[l]];
    l++;
    r--;
  }
};
```
