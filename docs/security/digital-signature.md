# 数字签名

> 关键词：明文、密文、非对称加密技术、数字签名、发送方、接收方、通信、消息摘要、算法、密钥、数据、加密、解密

数字签名是只有数据的发送方才能产生的且他人无法伪造的一段数字串，这段数字串同时也是对数据的发送方所发送的数据完整性的一个有效证明，它是一种类似写在纸上的普通的物理签名。一套数字签名算法通常定义两种互补的运算，一个用于签名，另一个用于验证。数字签名是对非对称加密技术与消息摘要的应用。

签名时使用发送方的私钥对明文的摘要进行加密，得到数字签名；验证时使用发送方的公钥对数字签名进行解密，得到明文的摘要。

数字签名实现通信数据完整性的基本过程：

- 发送方-签名：

  - 发送方首先对发送的明文采用 Hash 算法，得到一个固定长度的消息摘要。
  - 然后用保密的私钥对消息摘要进行签名，形成发送方的数字签名；
  - 最后将数字签名和明文一起发送给接收方。

- 接收方-验证：
  - 接收方首先用发送方的公钥对数字签名进行解密，得到发送方的消息摘要；
  - 然后用相同的 Hash 算法对明文进行 Hash 计算，得到接收方的消息摘要；
  - 最后将接收方的消息摘要与发送方的消息摘要进行比较，如果比较相同，则表示明文是完整的，且来自公钥持有者。
