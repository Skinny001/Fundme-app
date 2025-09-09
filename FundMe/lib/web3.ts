import { ethers } from "ethers"
import { showTransactionToast } from "@/lib/enhanced-toast";

export const XDC_APOTHEM_CONFIG = {
  chainId: 51,
  chainName: "XDC Apothem Network",
  nativeCurrency: {
    name: "XDC",
    symbol: "XDC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.apothem.network"],
  blockExplorerUrls: ["https://explorer.apothem.network"],
}

export const FUNDME_CONTRACT_ADDRESS = "0xc641225AcB6a4Ab5c21c5B04F72dD0F8F5878a49"

export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum
  }
  return null
}

export const getSigner = async () => {
  const provider = getProvider()
  if (!provider) throw new Error("No wallet provider found")
  return provider
}

export const isCorrectNetwork = async () => {
  const provider = getProvider()
  if (!provider) return false

  try {
    const chainId = await (provider as { request: (args: any) => Promise<any> }).request({ method: "eth_chainId" })
    return Number.parseInt(chainId, 16) === XDC_APOTHEM_CONFIG.chainId
  } catch (error) {
    return false
  }
}

export const switchToXDCNetwork = async () => {
  if (!window.ethereum) throw new Error("No wallet provider found")

  try {
    await (window.ethereum as { request: (args: any) => Promise<any> }).request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${XDC_APOTHEM_CONFIG.chainId.toString(16)}` }],
    })
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await (window.ethereum as { request: (args: any) => Promise<any> }).request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${XDC_APOTHEM_CONFIG.chainId.toString(16)}`,
            chainName: XDC_APOTHEM_CONFIG.chainName,
            nativeCurrency: XDC_APOTHEM_CONFIG.nativeCurrency,
            rpcUrls: XDC_APOTHEM_CONFIG.rpcUrls,
            blockExplorerUrls: XDC_APOTHEM_CONFIG.blockExplorerUrls,
          },
        ],
      })
    } else {
      throw switchError
    }
  }
}

export const formatXDC = (amount: string | number) => {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return `${(value / 1e18).toFixed(4)} XDC`
}

export const parseXDC = (amount: string) => {
  // Use BigInt to avoid scientific notation and ensure integer string
  const value = BigInt(Math.floor(Number.parseFloat(amount) * 1e18))
  return value.toString()
}

export const FUNDME_ABI = [
  {"type":"function","name":"campaigns","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"target","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"amountCollected","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"cancelCampaign","inputs":[{"name":"_id","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"createCampaign","inputs":[{"name":"_title","type":"string","internalType":"string"},{"name":"_description","type":"string","internalType":"string"},{"name":"_target","type":"uint256","internalType":"uint256"},{"name":"_deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},
  {"type":"function","name":"donateToCampaign","inputs":[{"name":"_id","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},
  {"type":"function","name":"getAllCampaigns","inputs":[],"outputs":[{"name":"","type":"address[]","internalType":"address[]"},{"name":"","type":"string[]","internalType":"string[]"},{"name":"","type":"string[]","internalType":"string[]"},{"name":"","type":"uint256[]","internalType":"uint256[]"},{"name":"","type":"uint256[]","internalType":"uint256[]"},{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},
  {"type":"function","name":"getCampaign","inputs":[{"name":"_id","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"target","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"amountCollected","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"getDonators","inputs":[{"name":"_id","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address[]","internalType":"address[]"},{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},
  {"type":"function","name":"numberOfCampaigns","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"refundDonor","inputs":[{"name":"_id","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"withdraw","inputs":[{"name":"_id","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"event","name":"CampaignCancelled","inputs":[{"name":"id","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},
  {"type":"event","name":"CampaignCreated","inputs":[{"name":"id","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"title","type":"string","indexed":false,"internalType":"string"},{"name":"target","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"deadline","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},
  {"type":"event","name":"DonationReceived","inputs":[{"name":"id","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"donor","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},
  {"type":"event","name":"Refund","inputs":[{"name":"id","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"donor","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},
  {"type":"event","name":"Withdrawal","inputs":[{"name":"id","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false}
]

export const getFundMeContract = async () => {
  const provider = typeof window !== "undefined" && window.ethereum
    ? new ethers.BrowserProvider(window.ethereum as any)
    : new ethers.JsonRpcProvider(XDC_APOTHEM_CONFIG.rpcUrls[0])
  const signer = typeof window !== "undefined" && window.ethereum
    ? await provider.getSigner()
    : undefined
  const contract = new ethers.Contract(FUNDME_CONTRACT_ADDRESS, FUNDME_ABI, signer || provider)

  return {
    getAllCampaigns: async () => {
      return await contract.getAllCampaigns()
    },
    getCampaign: async (id: number) => {
      return await contract.getCampaign(id)
    },
    getDonators: async (id: number) => {
      return await contract.getDonators(id)
    },
    createCampaign: async (_title: string, _description: string, _target: string, _deadline: string) => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await contract.createCampaign(_title, _description, _target, _deadline)
      return await tx.wait()
    },
    donateToCampaign: async (_id: number, value: string) => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await contract.donateToCampaign(_id, { value })
      return await tx.wait()
    },
    withdraw: async (_id: number) => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await contract.withdraw(_id)
      return await tx.wait()
    },
    refundDonor: async (_id: number) => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await contract.refundDonor(_id)
      return await tx.wait()
    },
    cancelCampaign: async (_id: number) => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await contract.cancelCampaign(_id)
      return await tx.wait()
    },
    numberOfCampaigns: async () => {
      return await contract.numberOfCampaigns()
    },
  }
}

export const listenToContractEvents = async () => {
  const provider = new ethers.JsonRpcProvider(XDC_APOTHEM_CONFIG.rpcUrls[0]);
  const contract = new ethers.Contract(FUNDME_CONTRACT_ADDRESS, FUNDME_ABI, provider);

  contract.on("CampaignCreated", (id, owner, title, target, deadline) => {
    console.log("Campaign Created:", { id, owner, title, target, deadline });
    showTransactionToast({
      title: "Campaign Created",
      description: `Campaign '${title}' has been successfully created!`,
    });
  });

  contract.on("DonationReceived", (id, donor, amount) => {
    console.log("Donation Received:", { id, donor, amount });
    showTransactionToast({
      title: "Donation Successful",
      description: `Thank you for your donation of ${formatXDC(amount)}!`,
    });
  });

  contract.on("Withdrawal", (id, owner, amount) => {
    console.log("Withdrawal Successful:", { id, owner, amount });
    showTransactionToast({
      title: "Withdrawal Successful",
      description: `Funds of ${formatXDC(amount)} have been withdrawn successfully!`,
    });
  });
};
