import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryTransferRepository, MemberWithPermission } from './transfer-repository.inmemory';
import { Transaction } from './transaction.model';
import { Transfer } from './transfer';
import { HAVE_PERSONNAL_ACCOUNT } from '@overbookd/permission';
import {
  INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
  PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
  TRANSFER_TO_YOURSELF_ERROR_MESSAGE,
} from './transfer.error';

const lea: MemberWithPermission = {
  id: 1,
  firstname: "Léa",
  lastname: "Mauyno",
  nickname: "Shogosse",
  balance: 2000,
  pemissions: [HAVE_PERSONNAL_ACCOUNT],
};
const noel: MemberWithPermission = {
  id: 2,
  firstname: "Noël",
  lastname: "Ertsemud",
  balance: 0,
  pemissions: [HAVE_PERSONNAL_ACCOUNT],
};
const tatouin: MemberWithPermission = {
  id: 3,
  firstname: "Tatouin",
  lastname: "Jesoph",
  balance: -1000,
  pemissions: [HAVE_PERSONNAL_ACCOUNT],
};
const neimad: MemberWithPermission = {
  id: 4,
  firstname: "Neimad",
  lastname: "reaucar",
  balance: 0,
  pemissions: [],
};
const adherents: MemberWithPermission[] = [lea, noel, tatouin, neimad];

const transactions: Transaction[] = [
  {
    id: 1,
    amount: 1500,
    from: { ...tatouin, balance: undefined },
    to: { ...lea, balance: undefined },
    context: "Com'chita",
    createdAt: new Date(2023, 9, 12),
  },
  {
    id: 2,
    amount: 500,
    from: { ...noel, balance: undefined },
    to: { ...tatouin, balance: undefined },
    context: "Bières",
    createdAt: new Date(2023, 7, 20),
  },
  {
    id: 3,
    amount: 500,
    from: { ...noel, balance: undefined },
    to: { ...lea, balance: undefined },
    context: "Repas burger midi",
    createdAt: new Date(2023, 9, 1),
  },
];

describe("Transfer", () => {
  let transfer: Transfer;
  let transferRepository: InMemoryTransferRepository;

  describe("when member create transfer", () => {
    beforeEach(() => {
      transferRepository = new InMemoryTransferRepository(
        transactions,
        adherents,
      );
      transfer = new Transfer(transferRepository);
    });

    describe("when adherent try to transfer to himself", () => {
      const transferToCreate = {
        to: lea.id,
        amount: 10,
        context: "Miam miam",
      };

      it("should indicate that adherent can't transfer to himself", async () => {
        expect(
          async () => await transfer.for(transferToCreate, lea.id)
        ).rejects.toThrow(TRANSFER_TO_YOURSELF_ERROR_MESSAGE);
      });
    });

    describe("when adherent try to transfer less than 1 cent", () => {
      const transferToCreate = {
        to: lea.id,
        amount: 0,
        context: "Miam miam",
      };

      it("should indicate that the minimum amount is 1 cent", async () => {
        expect(
          async () => await transfer.for(transferToCreate, lea.id)
        ).rejects.toThrow(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
      });
    });

    describe("when not allowed adherent try to transfer", () => {
      const transferToCreate = {
        to: lea.id,
        amount: 10,
        context: "Miam miam",
      };

      it("should indicate that adherent is not allowed to transfer", async () => {
        expect(
          async () => await transfer.for(transferToCreate, neimad.id)
        ).rejects.toThrow(PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE);
      });
    });

    describe("when allowed adherent try to create transfer", () => {
      describe("when adherent try to tranfer to adherent without personal account", () => {
        const transferToCreate = {
          to: neimad.id,
          amount: 10,
          context: "Miam miam",
        };

        it("should indicate that payee is not allowed to receive transfer", async () => {
          expect(
            async () => await transfer.for(transferToCreate, neimad.id)
          ).rejects.toThrow(PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE);
        });
      });

      describe.each`
        from          | to            | amount    | error
        ${lea.id}     | ${tatouin.id} | ${1000}   | ${undefined}
        ${tatouin.id} | ${noel.id}    | ${100000} | ${undefined}
        ${noel.id}    | ${noel.id}    | ${500}    | ${TRANSFER_TO_YOURSELF_ERROR_MESSAGE}
        ${lea.id}     | ${noel.id}    | ${-5000}  | ${INSUFFICIENT_AMOUNT_ERROR_MESSAGE}
        ${neimad.id}  | ${noel.id}    | ${1000}   | ${PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE}
        ${noel.id}    | ${neimad.id}  | ${1000}   | ${PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE}
      `(
        "when adherent try to transfer $amount cents from $from to $to",
        ({ from, to, amount }) => {
          const transferToCreate = {
            to,
            amount,
            context: "Miam miam",
          };

        }
      );
    });
  });
});
