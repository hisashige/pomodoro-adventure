import { Injectable } from "@nestjs/common";
import { Quest } from "./models/quest.model";
import { getQuestCollection } from "src/utils/firestore";
import { now } from "src/utils/dateUtils";
import { getFirestore } from "src/utils/firebase";
import { BulkUpdateQuestInput } from "./dto/bulk-update-quest.input";
import { QuestItem } from "./types";

@Injectable()
export class QuestsService {
  async updateQuests(
    uid: string,
    data: BulkUpdateQuestInput
  ): Promise<Quest[]> {
    try {
      const firestore = getFirestore();
      const questCollection = getQuestCollection();
      const batch = firestore.batch();

      const rtnItems = [];

      for (const item of data.quests) {
        const exitData = await questCollection
          .where("uid", "==", uid)
          .where("id", "==", item.id)
          .get();

        let modifyItem = { ...item, uid } as QuestItem;

        if (exitData.docs.length > 0) {
          // 更新
          modifyItem.createdAt = exitData.docs[0].data().createdAt;
          modifyItem.updatedAt = now();
          batch.update(exitData.docs[0].ref, modifyItem);
        } else {
          // 新規作成
          modifyItem.createdAt = now();
          modifyItem.updatedAt = null;
          const docRef = questCollection.doc(`${uid}_${item.id}`);
          batch.set(docRef, modifyItem);
        }

        rtnItems.push(modifyItem);
      }

      await batch.commit();

      return rtnItems as Quest[];
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e
    }
  }

  async findListByUid(uid: string): Promise<Quest[]> {
    const questCollection = getQuestCollection();
    const quests = await questCollection.where("uid", "==", uid).get();

    if (quests.docs.length > 0) {
      return quests.docs.map((doc) => doc.data()) as Quest[];
    }

    return [] as Quest[];
  }
}
