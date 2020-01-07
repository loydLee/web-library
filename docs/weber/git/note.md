# git使用笔记

## 合并分支
```
git merge --no-ff ...：不使用fast-forward方式合并，保留分支的commit历史
```
## 删除分支
```
删除远程分支：git push origin :远程分支名
删除本地分支：git branch -d 本地分支名
```

## 清除远程分支
```
git远程删除分支后，本地git branch -a 依然能看到的解决办法：git remote prune origin
```

## 更改git仓库
```
git remote set-url origin 新地址
```

## 从别人github地址上通过git clone下载下来, push到自己仓库
```
git rm -r --cached .
git config core.autocrlf false
git add .
```