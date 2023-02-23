echo "SCENARIO-1"
declare -a USERS=(daniel jose carlos cristian angela)

echo "SET CHEAP ENTRANCE FEE"
npx hardhat set-entrance-fee --fee 1 --network localhost

echo "LET ALL USERS SUBSCRIBE"
for i in "${USERS[@]}"
do
    npx hardhat subscribe --value 100 --signer $i --network localhost
done
