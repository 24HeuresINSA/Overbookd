rm -f .triage-policies.yml
cat .gitlab/triage_policies/head.yml >> .triage-policies.yml
for FILE in $(ls .gitlab/triage_policies/rules)
do
echo "\n" >> .triage-policies.yml
cat .gitlab/triage_policies/rules/$FILE >> .triage-policies.yml
done