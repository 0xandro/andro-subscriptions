echo "SCENARIO-2"
declare -a USERS=(daniel jose carlos cristian angela)

echo "LET ALL USERS UNSUBSCRIBE"
for i in "${USERS[@]}"
do
    npx hardhat unsubscribe --signer $i --network localhost
done
